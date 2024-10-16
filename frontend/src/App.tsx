import { Login } from "@/components/Login"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PoopLogo from "@/assets/poop.png"

export function App() {
  return (
    <div className="w-full h-screen bg-[#74512D] flex flex-col items-center justify-center">
      <img src={PoopLogo} alt="Foto de um poop usando óculos segurando um contador na mão" />

      <Tabs defaultValue="login" className="w-full bg-[#F8F4E1]">
        <TabsList className="w-full h-full flex justify-around bg-[#F8F4E1]">
          <TabsTrigger value="login" className="bg-[#F8F4E1]">Login</TabsTrigger>
          <TabsTrigger value="signup">Cadastro</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="w-full h-full">
          <Login />
        </TabsContent>

        <TabsContent value="signup" className="w-full h-full">
        
        </TabsContent>
      </Tabs>
    </div>
  )
}
