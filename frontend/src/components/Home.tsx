import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { CircleUserRound, SquarePlus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";


const parties = [
    {
        _id: "6729880e18f9c8e826a22968",
        name: "Os três mosqueteiros",
        createdBy: "671a99572963079125276a91",
        members: [
            { userId: "671a96993e93a40a8f6c6cf4", individualShits: 0 },
            { userId: "671a636591ab9df9fb474cd9", individualShits: 0 },
            { userId: "672cc6337800bb8672862bcd", individualShits: 0 },
            { userId: "672cd1f22698ed2c87797991", individualShits: 0 },
            { userId: "671a99572963079125276a91", individualShits: 4 }
        ],
        endDate: "2024-12-31T23:59:59.000Z",
        goals: [
            { targetShits: 100, completed: false },
            { targetShits: 200, completed: false },
            { targetShits: 300, completed: false }
        ],
        history: [
            { userId: "671a99572963079125276a91", shitTime: "2024-11-07T18:33:30.772Z" }
        ],
        createdAt: "2024-11-05T02:50:54.543Z",
        updatedAt: "2024-11-07T18:33:30.778Z"
    },
    {
        _id: "6729a20f23f7b9e839a33476",
        name: "The Power Poopers",
        createdBy: "671a96993e93a40a8f6c6cf4",
        members: [
            { userId: "671a99572963079125276a91", individualShits: 3 },
            { userId: "671a636591ab9df9fb474cd9", individualShits: 5 },
            { userId: "672cc6337800bb8672862bcd", individualShits: 2 }
        ],
        endDate: "2025-01-15T23:59:59.000Z",
        goals: [
            { targetShits: 50, completed: false },
            { targetShits: 150, completed: false },
            { targetShits: 250, completed: false }
        ],
        history: [
            { userId: "671a99572963079125276a91", shitTime: "2024-11-06T17:45:20.772Z" },
            { userId: "671a636591ab9df9fb474cd9", shitTime: "2024-11-07T10:25:30.772Z" }
        ],
        createdAt: "2024-11-06T14:20:54.543Z",
        updatedAt: "2024-11-07T11:30:30.778Z"
    },
    {
        _id: "6729c33a57e8f7c842a54678",
        name: "Flush Brothers",
        createdBy: "672cc6337800bb8672862bcd",
        members: [
            { userId: "672cc6337800bb8672862bcd", individualShits: 7 },
            { userId: "671a99572963079125276a91", individualShits: 4 },
            { userId: "671a96993e93a40a8f6c6cf4", individualShits: 1 }
        ],
        endDate: "2025-02-28T23:59:59.000Z",
        goals: [
            { targetShits: 100, completed: true },
            { targetShits: 200, completed: false },
            { targetShits: 300, completed: false }
        ],
        history: [
            { userId: "672cc6337800bb8672862bcd", shitTime: "2024-11-08T18:33:30.772Z" },
            { userId: "671a99572963079125276a91", shitTime: "2024-11-07T12:22:30.772Z" }
        ],
        createdAt: "2024-11-08T09:10:54.543Z",
        updatedAt: "2024-11-08T18:33:30.778Z"
    }
];

const CreatePartySchema = z.object({
    name: z.string().min(1, "Nome da party é obrigatório"),
    endDate: z.string().min(1, "Data de término é obrigatória"),
    memberEmail: z.string().email("Email inválido"),
})

export type User = {
    _id: string
    email: string
    password: string
    name: string
    parties: string[]
    createdAt: string
    updatedAt: string
}

interface Member extends Partial<User> {
    userId: string
    individualShits: number
}


export function Home() {
    const BACKEND_DOMAIN = import.meta.env.VITE_BACKEND_DOMAIN

    const form = useForm({
        resolver: zodResolver(CreatePartySchema),
        defaultValues: {
            name: "",
            endDate: "",
            memberEmail: "",
        },
    });

    const [members, setMembers] = useState<Member[]>([])
    const { toast } = useToast()

    const addMember = async (email: string) => {
        try {
            const response = await axios.get(`${BACKEND_DOMAIN}/users/email/${email}`)
            const user: User = response.data
            const userId = user._id

            const alreadyExists = members.some(member => member.userId === userId)

            if (alreadyExists) {
                toast({
                    variant: "destructive",
                    title: "O usuário já esta na lista de membros",
                    description: "Tente adicionar outro membro",
                })
                console.warn("Este usuário já está na lista de membros.")
                return;
            }

            setMembers([...members, { userId, individualShits: 0, email }])
            
        } catch (error: any) {
            console.error("Não foi possível adicionar o membro" + error.message)
        }
    }

    const onSubmit = (data: z.infer<typeof CreatePartySchema>) => {
        const partyData = {
            name: data.name,
            endDate: data.endDate,
            members,
        }
        console.log(partyData);
        form.reset();
    }

    return (
        <div className="w-full h-screen bg-brown-300">
            <Header />

            <div className="p-6">
                <div className="flex items-center justify-between">
                    <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                        Suas parties
                    </h1>

                    <Dialog>
                        <DialogTrigger>
                            <Button className="bg-brown-800 hover:bg-brown-500 font-semibold text-base">
                                <SquarePlus />
                                Criar Party
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-brown-100 rounded-lg">
                            <DialogHeader className="text-start">
                                <DialogTitle className="text-brown-700 text-2xl">Crie sua Party! 💩</DialogTitle>
                                <DialogDescription className="text-brown-500">
                                    Preencha os dados abaixo e crie sua party
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nome da Party</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nome da party" {...field} className="bg-brown-300 border-brown-600" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Data de Término</FormLabel>
                                                <FormControl>
                                                    <Input type="date" className="bg-brown-300 border-brown-600" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="memberEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Membros</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        <Input placeholder="Email do membro" {...field} className="bg-brown-300 border-brown-600" />
                                                        <Button type="button" onClick={() => addMember(field.value)} className="bg-brown-800 hover:bg-brown-500">
                                                            Adicionar
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <ul className="flex flex-col gap-2">
                                        {members.map((member, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <Input
                                                    type="text"
                                                    disabled
                                                    className="w-[150px]"
                                                    placeholder="Email do usuário"
                                                    value={member.email}
                                                    onChange={(e) => setMembers(members.map((m, i) =>
                                                        i === index ? { ...m, email: e.target.value } : m
                                                    ))}
                                                />
                                                <Input
                                                    type="number"
                                                    placeholder="Individual Shits"
                                                    value={member.individualShits}
                                                    onChange={(e) => setMembers(members.map((m, i) =>
                                                        i === index ? { ...m, individualShits: Number(e.target.value) } : m
                                                    ))}
                                                />
                                                <Button
                                                    className="bg-red-800 hover:bg-red-500"
                                                    onClick={() => setMembers(members.filter((_, i) => i !== index))}
                                                >
                                                    Remover
                                                </Button>
                                            </div>
                                        ))}
                                    </ul>

                                    <Button type="submit" className="bg-brown-800 hover:bg-brown-500 mt-2">Criar Party</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="py-5 mt-3 flex flex-col gap-6">
                    {parties.map((party) => (
                        <div key={party._id} className="rounded-3xl bg-brown-500">
                            <p className="text-center p-3 text-white text-2xl font-bold">
                                {party.name}
                            </p>

                            <div className="bg-brown-200 px-3 flex flex-col divide-y divide-brown-500">
                                {party.members.map((member, index) => (
                                    <>
                                        <div key={member.userId} className="flex items-center justify-between py-2">
                                            <div className="flex justify-between items-center gap-2">
                                                <CircleUserRound size={55} />
                                                <div className="font-semibold">
                                                    <p>John Doe</p>
                                                    <p>💩: {member.individualShits}</p>
                                                </div>
                                            </div>

                                            <div className="font-semibold">
                                                <p className="text-end">{index + 1}°</p>
                                                <p>2hrs atrás</p>
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>

                            <p className="text-center p-3 text-white text-2xl font-bold">
                                Total: {party.members.reduce((total, member) => total + member.individualShits, 0)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}