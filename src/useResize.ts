import { useEffect } from 'react'

let windowResizeEventAdded = false;

const callbacks: Array<Function> = [];

const handleWindowResizeEvent = () => callbacks.forEach((cb) => cb());

const removeWindowResizeEvent = () =>
    window.removeEventListener('resize', handleWindowResizeEvent);

const initWindowResizeEvent = () =>
    window.addEventListener('resize', handleWindowResizeEvent);

const onWindowResize = (callback) => {
    if (!windowResizeEventAdded) {
        initWindowResizeEvent();
        windowResizeEventAdded = true;
    }

    callbacks.push(callback);

    return () => {
        const i = callbacks.findIndex(callback);
        if (i !== -1) {
            callbacks.splice(i, 1);
        }

        if (!callbacks.length) {
            removeWindowResizeEvent();
            windowResizeEventAdded = false;    
        }
    }
}

export default function useResize(callback, throttle = 50) {
    useEffect(() => {
        let timeout
        
        const handleResize = () => {
            clearTimeout(timeout)
            timeout = setTimeout(callback, throttle)
        }

        return onWindowResize(handleResize);
    }, [])
}