import {
	type MouseEvent,
	type PointerEvent,
	type ReactNode,
	useRef,
} from "react";

export function Button({
	children,
	onPress,
	disabled,
}: {
	children: ReactNode;
	onPress?: () => void;
	disabled?: boolean;
}) {
	const isHandlingPointerDown = useRef(false);

	const onPointerDown = (e: PointerEvent) => {
		e.currentTarget.setPointerCapture(e.pointerId);
		isHandlingPointerDown.current = true;
		onPress?.();
	};

	const onClick = (_e: MouseEvent) => {
		if (isHandlingPointerDown.current) {
			isHandlingPointerDown.current = false;
		} else {
			onPress?.();
		}
	};

	return (
		<button onPointerDown={onPointerDown} onClick={onClick} disabled={disabled}>
			{children}
		</button>
	);
}
