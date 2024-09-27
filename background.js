chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getCookies') {
      console.log(message.url)
      const url = message.url
      chrome.cookies.getAll({ url }, (cookies) => {
        sendResponse({ cookies: cookies });
      });
      // Return true to indicate that the response will be sent asynchronously
      return true;
    } else if (message.action === 'removeCookie') {
        const url = message.url
        const name = message.name
        chrome.cookies.remove({ url: url, name: name }, (cookie) => {
          if (cookie) {
            console.log('cookie removed', cookie)
            sendResponse({ cookies: cookie });
          }
        });
        // Return true to indicate that the response will be sent asynchronously
        return true;
      }
  });