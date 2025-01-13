import { User } from "@/types/user"
import { CircleUserRound, History, Loader, PencilLine, Smile } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { LoggedUserProps } from "./ProfileWrapper"
import { Party } from "@/types/party"

export interface ProfileContext {
    user: User
    loggedUser: LoggedUserProps
    maxIndividualShits: number
    userEndedParties: Party[]
}

enum PositionEmojis {
    FIRST = "🥇",
    SECOND = "🥈",
    THIRD = "🥉",
}

function getPositionEmoji(position: number): string {
    switch (position) {
        case 1:
            return PositionEmojis.FIRST
        case 2:
            return PositionEmojis.SECOND
        case 3:
            return PositionEmojis.THIRD
        default:
            return `${position}º`
    }
}

export function Profile() {
    const { user, maxIndividualShits, loggedUser, userEndedParties } = useOutletContext<ProfileContext>()

    const navigate = useNavigate()

    function getUserPartyDetails(party: Party, userId: string) {
        const sortedMembers = [...party.members].sort(
            (a, b) => b.individualShits - a.individualShits
        )

        const userMember = sortedMembers.find(
            (member) => member.userId._id === userId
        )

        const userPosition = sortedMembers.findIndex(
            (member) => member.userId._id === userId
        ) + 1

        return { userMember, userPosition }
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
        <div className="w-full h-full overflow-hidden">
            <div className="w-full flex flex-col items-center z-10 relative pt-10">
                <div
                    className="w-[570px] h-[500px] bg-brown-500 absolute rounded-full -top-80 blur-sm"
                />

                {
                    user.profileImage !== "" ? (
                        <img
                            className="w-52 rounded-full h-52 z-10 border-4 border-brown-800 object-cover"
                            src={user.profileImage}
                            alt="Foto de perfil do usuário"
                        />
                    ) : (
                        <div className="z-10 bg-brown-300 rounded-full">
                            <CircleUserRound size={200} className="z-10" />
                        </div>
                    )
                }

                <h1 className="mt-2 font-bold text-2xl capitalize">
                    {user?.name}
                </h1>

                {user._id === loggedUser._id && (
                    <div className="absolute z-20 top-10 right-28 bg-blue-300 rounded-full p-2 border border-blue-900 hover:border-blue-200 cursor-pointer">
                        <PencilLine
                            size={28}
                            fill="#bfdbfe"
                            strokeWidth={2}
                            onClick={() => navigate("edit")}
                        />
                    </div>
                )}
            </div>

            <div className="w-full flex items-center justify-evenly text-center mt-6">
                <div>
                    <p className="font-bold text-2xl">{user.parties.length}</p>
                    <p className="text-brown-600">Parties</p>
                </div>

                <div>
                    <p className="font-bold text-2xl">{maxIndividualShits}</p>
                    <p className="text-brown-600">Cagadas</p>
                </div>

                <div>
                    <p className="font-bold text-2xl">{user.partyWins}</p>
                    <p className="text-brown-600">Vitórias</p>
                </div>
            </div>

            <div className="w-full my-7">
                <div className="px-6 flex flex-col gap-5">
                    <h1 className="underline text-brown-700 text-xl font-bold underline-offset-8">
                        Parties finalizadas
                    </h1>

                    {userEndedParties.length > 0 ? (
                        <div className="bg-brown-400 p-5 rounded-md">
                            {userEndedParties.map((party) => {
                                const { userMember, userPosition } = getUserPartyDetails(party, user._id)
                                const daysSincePartyEnded = Math.round((Date.now() - new Date(party.endDate).getTime()) / (1000 * 3600 * 24))

                                return (
                                    <div 
                                        key={party._id} 
                                        className="bg-brown-200 rounded-md px-5 py-3 border-2 border-brown-600 flex gap-3 items-center relative cursor-pointer"
                                        onClick={() => navigate(`/party/${party._id}`)}
                                    >
                                        <div className="bg-brown-300 rounded-full border border-dashed border-brown-600 w-14 h-14 text-center flex items-center justify-center">
                                            <p className="text-center text-4xl font-bold">
                                                {getPositionEmoji(userPosition)}
                                            </p>
                                        </div>

                                        <div className="text-md font-semibold">
                                            <h2>
                                                {party.name}
                                            </h2>

                                            {userMember && (
                                                <p>{userMember.individualShits} 💩</p>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center gap-2 absolute right-1 bottom-1">
                                            <p>{daysSincePartyEnded} {daysSincePartyEnded > 1 ? "dias" : "dia"}</p>
                                            <History size={20} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-sm text-center justify-center text-brown-500">
                            O usuário não possui parties finalizadas.
                            <Smile size={20} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}