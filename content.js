const container = document.createElement('div');
container.style.opacity = 0.5;
container.style.top = '40px';
container.style.right = '10px';
container.style.width = '240px';
container.style.zIndex = '1000';

// 创建按钮元素
const button = document.createElement('button');
button.innerText = '获取信息中';
button.style.padding = '10px 20px 10px 30px';
button.style.backgroundColor = '#2c2a49';
button.style.color = '#fff';
button.style.border = 'none';
button.style.borderRadius = '5px';
button.style.cursor = 'pointer';
button.style.fontSize = '10px';
button.style.width = '240px';
button.style.textAlign = 'left';

const closeButton = document.createElement('div');
closeButton.addEventListener('click', () => {
    container.style.display = 'none'
})
closeButton.innerText = 'x'
container.style.position='fixed'
closeButton.style.position='absolute'
closeButton.style.width='30px'
closeButton.style.height='20px'
closeButton.style.top='0px'
closeButton.style.right='0px'
closeButton.style.lineHeight='20px'
closeButton.style.textAlign='center'
closeButton.style.backgroundColor='red'
closeButton.style.opacity = '0.8';

container.appendChild(button)
container.appendChild(closeButton)

// Prevent default drag behavior
button.ondragstart = () => false;
// 将按钮添加到页面上
document.body.appendChild(container);

// 添加点击事件监听器
button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'removeCookie', url: window.location.href, name: 'SESSION' }, (response) => {
    // 发送请求
    fetch('https://ut.ucloudadmin.com/metersphere/isLogin', {
        method: 'GET',
        headers: {
        }
    })
    .then(response => response.json())
    .then(json => {
        localStorage.setItem('Admin-Token', JSON.stringify(json.data))
        showCookieExpireTime()
    })
    .catch(error => console.error('Error:', error));
  })
});

// 展示过期时间
showCookieExpireTime()

// 刷新5秒后自动关闭
setTimeout(() => {
    container.style.display = 'none';
    testTime()
}, 5000);

// 每分钟获取次过期时间
setInterval(() => {
    testTime()
}, 60*1000);

// 获取过期时间
function testTime() {
    chrome.runtime.sendMessage({ action: 'getCookies', url: window.location.href }, (response) => {
        if (response && response.cookies) {
            // console.log('Cookies:', response.cookies);
            const cookies = response.cookies;
            const now = new Date();
            const oneHourLater = new Date(now.getTime() + 60*60*1000)
            cookies.forEach(element => {
                // INNER_AUTH_TOKEN 是sso的token
                if (element.name==='INNER_AUTH_TOKEN') {
                    expire_time = new Date(element.expirationDate*1000)
                    if (expire_time < oneHourLater) {
                        // 一个小时内过期，就展示提示框
                        container.style.display = 'block'
                    }
                } else if (element.name==='SESSION') {  // SESSION 是ms的token
                    expire_time = new Date(element.expirationDate*1000)
                    if (expire_time < oneHourLater) {
                        // 一个小时内过期，就展示提示框
                        container.style.display = 'block'
                    }
                }
                
            });
          // Here you can process the cookies or send them to a popup or storage
        } else {
            console.log('No cookies found.');
        }
    })
}

function showCookieExpireTime() {
    chrome.runtime.sendMessage({ action: 'getCookies', url: window.location.href }, (response) => {
        if (response && response.cookies) {
            // console.log('Cookies:', response.cookies);
            const cookies = response.cookies;
            button.innerText = cookies.length>0?'':'获取信息失败'
            cookies.forEach(element => {
                if (element.name==='INNER_AUTH_TOKEN') {
                    expire_time = new Date(element.expirationDate*1000)
                    if(button.innerText.length!==0) {
                        button.innerText += '\n'
                    }
                    button.innerText += 'SSO 过期时间:  ' + formatDate(expire_time)
                } else if (element.name==='SESSION') {
                    expire_time = new Date(element.expirationDate*1000)
                    if(button.innerText.length!==0) {
                        button.innerText += '\n'
                    }
                    button.innerText += 'MS - 过期时间:  ' + formatDate(expire_time)
                }
                
            });
          // Here you can process the cookies or send them to a popup or storage
        } else {
            console.log('No cookies found.');
        }
    });
}

function formatDate(date) {
    // 获取年、月、日、小时、分钟和秒
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    // 格式化字符串
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
