import { useEffect, useState } from "react";

const LoadingBar = ({ isLoading, color = 'bg-yellow-500', height = 'h-0.5' }) => {
	const [isVisible, setIsVisible] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (isLoading) {
			setIsVisible(true);
			setProgress(30);
		} else {
			setProgress(100);
			setTimeout(() => {
				setIsVisible(false);
				setProgress(0);
			}, 300);
		}
	}, [isLoading]);

	useEffect(() => {
		if (!isVisible) return;

		const interval = setInterval(() => {
			setProgress(prev => {
				if (prev >= 95) return prev;
				if (prev >= 90) return prev + 1;
				return prev + 10;
			});
		}, progress >= 90 ? 1000 : 200);

		return () => clearInterval(interval);
	}, [isVisible]);

	if (!isVisible) return null;

	return (
		<div className="fixed top-0 left-0 w-full z-50">
			<div
				className={`${height} ${color} transition-all duration-300 ease-out`}
				style={{
					width: `${progress}%`,
					transform: `translateX(${progress - 100}%)`
				}}
			/>
		</div>
	);
};

export default LoadingBar