import { Party } from "@/types/party"
import { CircleUserRound, Crown, ShieldCheck, SquarePen, SquareX } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AddMemberForm } from "./AddMemberForm";

export function MemberList() {
    const location = useLocation();
    const partyInfo: Party = location.state

    return (
        <div className="w-full h-full p-6 bg-brown-300">
            <div className="flex items-center justify-between">
                <h1 className="underline text-brown-700 text-3xl font-bold underline-offset-8">
                    Membros
                </h1>

                <AddMemberForm members={partyInfo.members} partyId={partyInfo._id} />
            </div>

            <div className="w-full h-full flex flex-col gap-3 my-6">
                {partyInfo.members.sort((a, b) => b.individualShits - a.individualShits).map((member, index) => {
                    const isMemberAdmin = partyInfo.createdBy === member.userId._id

                    return (
                        <div key={member.userId._id} className="bg-brown-400 rounded-lg p-3 flex items-center gap-3 relative text-brown-300">
                            <CircleUserRound size={60} />

                            <div className="">
                                <p className="capitalize font-semibold text-lg flex items-center gap-2">
                                    {index === 0 && member.individualShits > 0 && (
                                        <Crown className="" size={24} fill="yellow" stroke="black" />
                                    )}
                                    {member.userId.name}
                                </p>

                                <p className="font-semibold text-lg">
                                    {member.individualShits} 💩
                                </p>
                            </div>

                            <div className="absolute top-2 right-2 flex gap-3">
                                <SquarePen className="text-blue-700" />
                                {isMemberAdmin ? (
                                    <ShieldCheck color="black" fill="yellow" />
                                ) : (
                                    <SquareX className="text-red-700" />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}