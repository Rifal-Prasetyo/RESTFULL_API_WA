import getFbVideoInfo from 'fb-downloader-scrapper';
// const cookies = "your-fb-cookies"
// const userAgent = "your-user-agent"

getFbVideoInfo("https://www.facebook.com/reel/1400877780614928")
    .then((result) => {
        console.log(result)
    }).catch((err) => {
        console.log(err)
    })

