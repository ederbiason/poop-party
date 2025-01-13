import NotFoundPoop from "@/assets/error-404-poop.png"

export function NoMatch() {
    return (
        <div className="min-h-screen text-center pt-10 text-lg font-semibold text-brown-600">
            <p>Alguma coisa deu errado!</p>
            <p>Página não encontrada</p>
            <img src={NotFoundPoop} alt="Imagem de erro 404 - Página não encontrada" className="animate-pulse" />
        </div>
    )
}
