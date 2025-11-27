"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

const AddToCartButton = ({ productId }: { productId: number }) => {
    const { userId } = useAuth();
    const cart = useCart();

    const handleClick = async () => {
        await cart.add(productId, userId);
    };

    return <Button onClick={handleClick}>Add to Cart</Button>;
};

export default AddToCartButton;

{
    /* TODO: come back and fix/handle user registration for adding to cart*/
    /* TODO: The point of the code below was to have a use effect which checks for a session,
        if there is a session then simply add to cart without forcing registation, else, force
        registration
        const [open, setOpen] = React.useState(false);
        useEffect(() => {
            const eff = async () => {
                const supabase = createClient();
                const {
                    data: { session },
                    error,
                } = await supabase.auth.getSession();

                !session ? useSignIn() : null;
            };

            eff();
        }, []);
        */
    /* TODO: come back and fix/handle user registration for adding to cart*/
    /* <Button onClick={() => setOpen(true)}>Add to Cart</Button> */
    /* Add to cart modal */
    /* <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add to Cart</DialogTitle>
                        <DialogDescription>Enter your email to add this product to your cart.</DialogDescription>
                    </DialogHeader>
                    <form className="mt-4 space-y-3">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="name@example.com" />
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full">
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            */
}
