
## Simple js
```jsx
const video = document.createElement('video');
video.srcObject = stream;
video.id = userId;
video.addEventListener('loadedmetadata', () => {
    video.play();
});
```

## React
```tsx
export const VideoStream: React.FC = ({ stream, id }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef, stream]);

    return (
            <video
                id={id}
                ref={videoRef}
                onLoadedMetadata={() => {
                    videoRef?.current?.play();
                }}
            />
    );
};
```
