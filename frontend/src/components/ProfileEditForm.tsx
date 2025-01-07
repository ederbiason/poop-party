import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { z } from "zod"
import { useDropzone } from "react-dropzone"
import { Loader, Lock, Mail, UserRound, UserRoundPen } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import { ProfileContext } from "./Profile"
import { useToast } from "@/hooks/use-toast"
import { useCallback, useEffect, useState } from "react"
import { uploadImageAndReturnUrl } from "@/utils/imageHandling"


const ProfileEditFormSchema = z.object({
    email: z.string().email({ message: "Email inválido" }).optional(),
    name: z.string().optional(),
    password: z.string().optional(),
    newPassword: z.string().optional(),
    profileImage: z.string().optional()
}).transform((data) => {
    return Object.fromEntries(
        Object.entries(data).filter(([key, value]) => key === "profileImage" || value !== "")
    )
})

export function ProfileEditForm() {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>("")

    const { user } = useOutletContext<ProfileContext>()

    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(ProfileEditFormSchema),
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            password: "",
            newPassword: "",
            profileImage: user?.profileImage || ""
        },
    })

    const { reset } = form

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || "",
                email: user.email || "",
                password: "",
                newPassword: "",
                profileImage: user.profileImage || ""
            })
        }
    }, [user])

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) {
                setPreview(null)
                form.setValue("profileImage", "")
                return
            }

            const reader = new FileReader()

            reader.onload = async () => {
                const previewData = reader.result
                setPreview(previewData)

                try {
                    const profileImageUrl = await uploadImageAndReturnUrl(acceptedFiles[0])
                    form.setValue("profileImage", profileImageUrl, { shouldValidate: true, shouldDirty: true })
                    form.clearErrors("profileImage")
                } catch (error) {
                    console.error("Erro ao fazer upload da imagem:", error)
                    setPreview(null)
                }
            }

            reader.readAsDataURL(acceptedFiles[0])
        },
        [form]
    )

    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1000000,
        accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    })


    async function onSubmit(values: z.infer<typeof ProfileEditFormSchema>) {
        try {
            await axios.patch(`${import.meta.env.VITE_BACKEND_DOMAIN}/users/${user._id}`, values)

            toast({
                variant: "default",
                title: "Sucesso",
                description: "Você atualizou o seu perfil!",
            })
        } catch (error: any) {
            console.error(error.message)
        }
    }

    if (!user) {
        return (
            <div className="w-full h-full flex mt-10 justify-center gap-2 bg-brown-300 min-h-screen">
                <Loader className="animate-spin" />
                Carregando perfil do usuário
            </div>
        )
    }

    return (
        <div className="p-6">
            <div>
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Suas informações
                </h1>

                <div className="pt-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3">
                                <FormField
                                    control={form.control}
                                    name="profileImage"
                                    render={() => (
                                        <FormItem className="mx-auto md:w-1/2 flex flex-col items-center">
                                            <FormLabel
                                                className={fileRejections.length !== 0 ? "text-destructive" : ""}
                                            >
                                                <h2 className="text-brown-700 text-lg font-semibold tracking-tight">
                                                    Foto de Perfil
                                                    <span
                                                        className={
                                                            form.formState.errors.profileImage || fileRejections.length !== 0
                                                                ? "text-destructive"
                                                                : "text-muted-foreground"
                                                        }
                                                    ></span>
                                                </h2>
                                            </FormLabel>

                                            <FormControl>
                                                <div
                                                    {...getRootProps()}
                                                    className="mx-auto flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-brown-700 p-2 min-h-40 min-w-40 rounded-full"
                                                >
                                                    {
                                                        user.profileImage !== "" && preview === "" ? (
                                                            <img
                                                                src={user.profileImage}
                                                                alt="Imagem de perfil do usuário"
                                                                className="h-40 w-40 rounded-full object-cover"
                                                            />
                                                        ) : preview ? (
                                                            <img
                                                                src={preview as string}
                                                                alt="Foto que foi enviada pelo usuário"
                                                                className="h-40 w-40 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <UserRound
                                                                className={`size-20 ${preview ? "hidden" : "block"}`}
                                                            />
                                                        )
                                                    }

                                                    <Input
                                                        {...getInputProps()}
                                                        type="file"
                                                    />
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="name" className="text-brown-700 text-lg font-semibold">Nome</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="name"
                                                    id="name"
                                                    placeholder="Digite seu nome"
                                                    startIcon={UserRoundPen}
                                                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="email" className="text-brown-700 text-lg font-semibold">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    id="email"
                                                    placeholder="Digite seu email"
                                                    startIcon={Mail}
                                                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="password" className="text-brown-700 text-lg font-semibold">Senha atual</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    id="password"
                                                    placeholder="Digite sua senha atual"
                                                    startIcon={Lock}
                                                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="newPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel htmlFor="newPassword" className="text-brown-700 text-lg font-semibold">Nova senha</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="password"
                                                    id="newPassword"
                                                    placeholder="Digite sua nova senha"
                                                    startIcon={Lock}
                                                    className="border-brown-700 placeholder:text-brown-700 placeholder:text-base py-6 bg-white bg-opacity-50"
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-3 mt-8">
                                <Button type="submit" className="w-full rounded-full p-7 bg-brown-800 font-semibold text-lg text-brown-300">
                                    Salvar
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div >
    )
}