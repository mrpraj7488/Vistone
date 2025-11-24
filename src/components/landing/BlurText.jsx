import { motion } from 'motion/react';
import { useEffect, useRef, useState, useMemo } from 'react';

const buildKeyframes = (from, steps) => {
    const keys = new Set([...Object.keys(from), ...steps.flatMap(s => Object.keys(s))]);

    const keyframes = {};
    keys.forEach(k => {
        keyframes[k] = [from[k], ...steps.map(s => s[k])];
    });
    return keyframes;
};

const BlurText = ({
    text = '',
    delay = 200,
    className = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.0,
    rootMargin = '0px',
    animationFrom,
    animationTo,
    easing = t => t,
    onAnimationComplete,
    stepDuration = 0.35
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const [inView, setInView] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // Auto-trigger animation on mount for immediate visibility
        const timer = setTimeout(() => {
            setInView(true);
        }, 100);

        if (!ref.current) {
            clearTimeout(timer);
            return;
        }
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.unobserve(ref.current);
                }
            },
            { threshold, rootMargin }
        );
        observer.observe(ref.current);
        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threshold, rootMargin]);

    const defaultFrom = useMemo(
        () =>
            direction === 'top' ? { filter: 'blur(10px)', opacity: 0, y: -50 } : { filter: 'blur(10px)', opacity: 0, y: 50 },
        [direction]
    );

    const defaultTo = useMemo(
        () => [
            {
                filter: 'blur(5px)',
                opacity: 0.5,
                y: direction === 'top' ? 5 : -5
            },
            { filter: 'blur(0px)', opacity: 1, y: 0 }
        ],
        [direction]
    );

    const fromSnapshot = animationFrom ?? defaultFrom;
    const toSnapshots = animationTo ?? defaultTo;

    const stepCount = toSnapshots.length + 1;
    const totalDuration = stepDuration * (stepCount - 1);
    const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

    return (
        <span 
            ref={ref} 
            className={className} 
            style={{ 
                display: 'inline-block', 
                fontSize: 'inherit', 
                lineHeight: 'inherit', 
                fontWeight: 'inherit', 
                width: '100%',
                whiteSpace: 'normal'
            }}
        >
            {elements.map((segment, index) => {
                const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

                const spanTransition = {
                    duration: totalDuration,
                    times,
                    delay: (index * delay) / 1000,
                    ease: easing
                };

                return (
                    <motion.span
                        className="inline-block will-change-[transform,filter,opacity] whitespace-pre"
                        key={`${segment}-${index}`}
                        initial={fromSnapshot}
                        animate={inView ? animateKeyframes : fromSnapshot}
                        transition={spanTransition}
                        onAnimationComplete={index === elements.length - 1 ? onAnimationComplete : undefined}
                        style={{ 
                            fontSize: 'inherit', 
                            lineHeight: 'inherit', 
                            fontWeight: 'inherit',
                            marginRight: animateBy === 'words' && index < elements.length - 1 ? '0.25em' : '0'
                        }}
                    >
                        {segment}
                        {animateBy === 'words' && index < elements.length - 1 ? ' ' : ''}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default BlurText;
