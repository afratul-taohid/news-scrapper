const autoScroll = async function(page, maxScroll) {
     await page.setViewport({
        width: 1200,
        height: 800
    })
    await _scroll(page, maxScroll)
}


async function _scroll(page, maxScroll){
    
    await page.evaluate(async () => {

        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                // console.log('scrollHeight - window.innerHeight: ' + scrollHeight - window.innerHeight)

                if(totalHeight >= 500){
                    clearInterval(timer);
                    resolve();
                }

            }, 200);
        });
    });
}

module.exports = {
    autoScroll,
}