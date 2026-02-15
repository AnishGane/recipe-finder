import { CookingPot } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen w-full bg-stone-900 relative">
            {/* Copper & Bronze Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 50% 50%, 
                        rgba(194, 65, 12, 0.18) 0%, 
                        rgba(194, 65, 12, 0.1) 25%, 
                        rgba(194, 65, 12, 0.04) 35%, 
                        transparent 50%
                        )
                    `,
                    backgroundSize: "100% 100%",
                }}
            />

            <div className="grid min-h-screen lg:grid-cols-2 relative z-10">
                <div className="flex flex-col gap-4 p-6 md:p-10">
                    <div className="flex justify-center font-semibold gap-2 text-white md:justify-start">
                        <div className="bg-destructive flex size-6 items-center text-white justify-center rounded-sm">
                            <CookingPot className="size-4" />
                        </div>
                        Flavourly
                    </div>
                    <div className="flex flex-1 text-primary-foreground items-center justify-center">
                        <div className="w-full max-w-xs">
                            {children}
                        </div>
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src="/auth_bg.jfif"
                        alt="auth background image"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    )
}