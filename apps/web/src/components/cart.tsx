import { useQuery } from "@rocicorp/zero/react";
import { useRouter } from "@tanstack/react-router";
import { getCartItemsQuery } from "../routes/_layout/cart";
import { Link } from "./link";

export function Cart() {
	const { session } = useRouter().options.context;

	const [items] = useQuery(getCartItemsQuery(session.data?.userID ?? ""));

	if (!session.data) {
		return null;
	}

	return <Link to="/cart">Cart ({items.length ?? 0})</Link>;
}
