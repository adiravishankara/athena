/// <reference types="npm:@types/chrome" />

// コマンドショートカットのリスナーを設定
chrome.commands.onCommand.addListener((command) => {
    if (command === "run-automation") {
      runAutomation();
    }
  });
  
  // メイン処理を実行する関数
  async function runAutomation() {
    try {
      // 現在のタブのURLを取得
      const [currentTab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!currentTab || !currentTab.id) {
        console.error("現在のタブが見つかりません");
        return;
      }
  
      const originalUrl = currentTab.url;
      if (!originalUrl) {
        console.error("現在のタブのURLが取得できません");
        return;
      }
  
      console.log("元のURL:", originalUrl);
  
      // 新しいタブでNotebookLMを開く
      const newTab = await chrome.tabs.create({
        url: "https://notebooklm.google.com/",
      });
      if (!newTab || !newTab.id) {
        console.error("新しいタブが作成できませんでした");
        return;
      }
  
      // タブが完全に読み込まれるのを待つ
      await waitForTabLoad(newTab.id);
  
      // 「Create New」ボタンをクリック
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: clickCreateNewButton,
      });
  
      // 0.5秒待機
      await new Promise((resolve) => setTimeout(resolve, 500));
  
      // 「Website」ボタンをクリックし、URLを貼り付けて「Insert」ボタンをクリック
      await chrome.scripting.executeScript({
        target: { tabId: newTab.id },
        func: processWebsiteInput,
        args: [originalUrl],
      });
  
      console.log("自動化処理が完了しました");
    } catch (error) {
      console.error("自動化処理中にエラーが発生しました:", error);
    }
  }
  
  // タブの読み込みが完了するのを待つ関数
  function waitForTabLoad(tabId: number): Promise<void> {
    return new Promise((resolve) => {
      const listener = (
        updatedTabId: number,
        changeInfo: chrome.tabs.TabChangeInfo,
      ) => {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);
          // ページが完全に読み込まれた後、少し待機して確実にDOMが準備されるようにする
          setTimeout(resolve, 500);
        }
      };
  
      chrome.tabs.onUpdated.addListener(listener);
    });
  }
  
  // 「Create New」ボタンをクリックする関数
  function clickCreateNewButton(): void {
    try {
      // ボタンのセレクタを探す（実際のセレクタは変わる可能性があるため、複数のパターンを試す）
      const selectors = [
        "button.create-new-button",
        '[data-test-id="create-new-button"]',
        "button.mat-button",
        "button.mat-raised-button",
        "button.mat-flat-button",
        "button", // 最後の手段として全ボタンを検索
        'a[role="button"]', // ボタンとして機能するリンク要素
      ];
  
      let button: HTMLElement | null = null;
  
      // セレクタを試す
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent?.toLowerCase() || "";
          if (text.includes("create new")) {
            button = element as HTMLElement;
            break;
          }
        }
        if (button) break;
      }
  
      if (button) {
        console.log("「Create New」ボタンを見つけました");
        button.click();
      } else {
        console.error("「Create New」ボタンが見つかりませんでした");
      }
    } catch (error) {
      console.error(
        "「Create New」ボタンのクリック中にエラーが発生しました:",
        error,
      );
    }
  }
  
  // 「Website」ボタンをクリックし、URLを貼り付けて「Insert」ボタンをクリックする関数
  function processWebsiteInput(originalUrl: string): void {
    try {
      // Website chipのセレクタを探す
      const websiteSelectors = [
        'mat-chip[jslog*="230546"]',
        "mat-chip.mat-mdc-chip",
        '.mat-mdc-chip:has(mat-icon[data-mat-icon-type="font"])',
        ".mdc-evolution-chip",
        // より具体的なセレクタ
        ".mat-mdc-chip .mdc-evolution-chip__text-label",
        // フォールバックオプション
        '[class*="chip"]',
      ];
  
      let websiteChip: HTMLElement | null = null;
  
      // セレクタを試す
      for (const selector of websiteSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          // テキストを探す場所を広げる
          const textContent = element.textContent?.toLowerCase() || "";
          const hasWebIcon =
            element.querySelector('mat-icon[data-mat-icon-type="font"]')
              ?.textContent === "web";
  
          if (textContent.includes("website") || hasWebIcon) {
            websiteChip = element as HTMLElement;
            break;
          }
        }
        if (websiteChip) break;
      }
  
      if (websiteChip) {
        console.log("「Website」チップを見つけました");
        // クリックイベントをディスパッチ
        websiteChip.click();
  
        // URLを入力するための入力フィールドが表示されるまで少し待機
        setTimeout(() => {
          // URL入力フィールドを探す
          const urlInputSelectors = [
            'input[type="url"]',
            'input[placeholder*="url" i]',
            'textarea[placeholder*="url" i]',
            "input.mat-mdc-input-element",
            // Material Design固有のセレクタ
            ".mat-mdc-form-field input",
            ".mat-mdc-input-element",
          ];
  
          let urlInput: HTMLInputElement | HTMLTextAreaElement | null = null;
  
          // セレクタを試す
          for (const selector of urlInputSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              urlInput = element as HTMLInputElement | HTMLTextAreaElement;
              break;
            }
          }
  
          if (urlInput) {
            console.log("URL入力フィールドを見つけました");
            urlInput.value = originalUrl;
            urlInput.dispatchEvent(new Event("input", { bubbles: true }));
            urlInput.dispatchEvent(new Event("change", { bubbles: true }));
  
            // 「Insert」ボタンを探す
            setTimeout(() => {
              const insertSelectors = [
                "button.mat-mdc-button-base",
                ".mat-mdc-button:not([disabled])",
                ".mdc-button",
                '[jslog*="generic_click"]',
              ];
  
              let insertButton: HTMLElement | null = null;
  
              // セレクタを試す
              for (const selector of insertSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                  const text = element.textContent?.toLowerCase() || "";
                  if (text.includes("insert")) {
                    insertButton = element as HTMLElement;
                    break;
                  }
                }
                if (insertButton) break;
              }
  
              if (insertButton) {
                console.log("「Insert」ボタンを見つけました");
                insertButton.click();
              } else {
                console.error("「Insert」ボタンが見つかりませんでした");
              }
            }, 500);
          } else {
            console.error("URL入力フィールドが見つかりませんでした");
          }
        }, 500);
      } else {
        console.error("「Website」チップが見つかりませんでした");
      }
    } catch (error) {
      console.error("Websiteの処理中にエラーが発生しました:", error);
    }
  }