// install 事件一般是被用来填充你的浏览器的离线缓存
this.addEventListener('install', function(event) {
  // 这会确保Service Worker 不会在 waitUntil() 里面的代码执行完毕之前安装完成
  event.waitUntil(
    // cache使我们可以存储网络响应发来的资源，并且根据它们的请求来生成key
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        'src/sw-test/',
        'src/sw-test/index.html',
        'src/sw-test/style.css',
        'src/sw-test/app.js',
        'src/sw-test/image-list.js',
        'src/sw-test/star-wars-logo.jpg',
        'src/sw-test/gallery/',
        'src/sw-test/gallery/bountyHunters.jpg',
        'src/sw-test/gallery/myLittleVader.jpg',
        'src/sw-test/gallery/snowTroopers.jpg'
      ]);
    })
  );
});