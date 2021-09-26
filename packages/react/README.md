
```jsx
// One way
const video = document.createElement('video');
video.srcObject = stream;
video.id = userId;
video.addEventListener('loadedmetadata', () => {
    video.play();
});

// React way


```
