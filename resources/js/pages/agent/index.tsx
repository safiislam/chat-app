import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { router } from "@inertiajs/react";


export default function ManageChat() {
    const handelChat = () => {
        router.post('chat', {

        }, {
            onSuccess: (res) => {
                console.log(res)
            }
        })
    }
    return (
        <AppLayout>
            <div>
                <Button onClick={handelChat}>chat</Button>
            </div>
        </AppLayout>
    )
}
