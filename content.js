const container2 = document.createElement('div');
container2.style.opacity = 0.7;
container2.style.top = '40px';
container2.style.right = '10px';
container2.style.width = '240px';
container2.style.zIndex = '1000000';
container2.style.backgroundColor = '#2c2a49';
// container2.style.borderRadius = '5px 5px 0 0';
container2.style.position='fixed'
// container2.style.padding = '8px 0px 7px 15px'

const container = document.createElement('div');
container.style.opacity = 0.7;
container.style.top = '83px';
container.style.right = '10px';
container.style.width = '240px';
container.style.zIndex = '1000000';
container.style.backgroundColor = '#2c2a49';
container.style.borderRadius = '0 0 5px 5px';
container.style.position='fixed'

// 刷新seesion的按钮
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

// 对应的关闭按钮
const closeButton = document.createElement('div');
closeButton.addEventListener('click', () => {
    container.style.display = 'none'
})
closeButton.innerText = 'x'

closeButton.style.position='absolute'
closeButton.style.width='22px'
closeButton.style.height='20px'
closeButton.style.top='0px'
closeButton.style.right='0px'
closeButton.style.lineHeight='20px'
closeButton.style.textAlign='center'
closeButton.style.backgroundColor='#bf6060'
closeButton.style.opacity = '0.8';

// 输入目标文本的输入框
const inputElement = document.createElement('input');
inputElement.id = "tar_inputElement"
inputElement.placeholder = '输入目标文本';
inputElement.style.margin = '10px';
// inputElement.style.marginRight = '0px';
inputElement.style.padding = '5px';
inputElement.style.fontSize = '10px';
inputElement.style.width = '120px';


// 对应的提交按钮
const checkButton = document.createElement('button');
checkButton.innerText = '点击通过';
// checkButton.style.padding = '10px 20px 10px 30px';
checkButton.style.backgroundColor = '#67c23a';
checkButton.style.color = '#fff';
checkButton.style.border = 'none';
checkButton.style.borderRadius = '5px';
checkButton.style.cursor = 'pointer';
checkButton.style.fontSize = '10px';
checkButton.style.width = '60px';
checkButton.style.height = '26px';
checkButton.style.lineHeight = '26px';
checkButton.style.textAlign = 'center';
checkButton.style.marginRight = '5px';

// 对应的关闭按钮
const closeButton2 = document.createElement('div');
closeButton2.addEventListener('click', () => {
    container2.style.display = 'none'
})
closeButton2.innerText = 'x'

closeButton2.style.position='absolute'
closeButton2.style.width='22px'
closeButton2.style.height='20px'
closeButton2.style.top='0px'
closeButton2.style.right='0px'
closeButton2.style.lineHeight='20px'
closeButton2.style.textAlign='center'
closeButton2.style.backgroundColor='#bf6060'
closeButton2.style.opacity = '0.8';

container.appendChild(button)
container.appendChild(closeButton)
container2.appendChild(inputElement)
container2.appendChild(checkButton)
container2.appendChild(closeButton2)

// Prevent default drag behavior
button.ondragstart = () => false;
// 将按钮添加到页面上
document.body.appendChild(container2);
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

checkButton.addEventListener('click', () => {
    specifiedValue = inputElement.value
    // console.log("**",specifiedValue)
    // 获取这个表格元素，看了下是第4个
    var tableElement = document.querySelectorAll('tbody')[3]; 
    
    // 遍历表格的所有行
    for (var i = 0, row; row = tableElement.rows[i]; i++) {
        // 指定列，第4列和第5列
        let tar_col_item = row.cells[3].querySelector('textarea')
        let res_col_item = row.cells[4].querySelector('.el-input').querySelector('input')
        // 检查当前单元格是否==specifiedValue
        if (specifiedValue == tar_col_item.value) {
            // console.log('找到了');
            res_col_item.value = "通过"
        }
    }
});

