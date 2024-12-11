import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UserPlus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function AddMemberForm() {
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)

    async function handleAddMemberSubmit() {
        try {
            
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger
                className="w-fit items-center text-brown-300 bg-brown-800 hover:bg-brown-500 font-semibold text-base flex p-2 px-3 rounded-md gap-2"
                onClick={() => setIsAddMemberDialogOpen(true)}
            >
                <UserPlus />
                Adicionar
            </DialogTrigger>
            <DialogContent className="bg-brown-100 rounded-lg">
                <DialogHeader className="text-start">
                    <DialogTitle className="text-brown-700 text-2xl">
                        Novo Membro
                    </DialogTitle>
                    <DialogDescription className="text-brown-500">
                        Preencha os campos abaixo e adicione um novo membro!
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    Formulário para adicionar membro
                </div>

                <Button
                    type="submit"
                    onClick={() => handleAddMemberSubmit()}
                    className="bg-brown-800 hover:bg-brown-500 mt-2"
                >
                    Adicionar
                </Button>
            </DialogContent>
        </Dialog>
    )
}