// install 事件一般是被用来填充你的浏览器的离线缓存
this.addEventListener('install', function(event) {
  // 这会确保Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // cache使我们可以存储网络响应发来的资源，并且根据它们的请求来生成key
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'app.js',
        'image-list.js',
        'star-wars-logo.jpg',
        // 'gallery/',
        'gallery/bountyHunters.jpg',
        'gallery/myLittleVader.jpg',
        'gallery/snowTroopers.jpg'
      ]);
    })
  );
});