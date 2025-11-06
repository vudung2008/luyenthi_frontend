import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import * as z from "zod";


const signInSchema = z.object({
  username: z.string().min(6, "Tên đăng nhập phải >= 6 ký tự"),
  password: z.string().min(6, "Mật khẩu phải >= 6 ký tự"),
})

type SignInFormValues = z.infer<typeof signInSchema>;

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {

      const { username, password } = data;

      await signIn(username, password);
      navigate("/");
    } catch (error) {
      console.error('.');
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">

              <div className="flex flex-col items-center gap-6 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Đăng nhập vào tài khoản luyenthi.??? của bạn
                </p>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label className='block text-sm' htmlFor="username">Tên đăng nhập</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="user1"
                  required
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center">
                  <Label className='block text-sm' htmlFor="password">Mật khẩu</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <Input id="password" type="password" required {...register("password")} />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button
                type='submit'
                className='w-full'
                disabled={isSubmitting}>
                Đăng nhập
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản? <a href="/signup" className="underline underline-offset-4 hover:text-primary">Đăng ký</a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className=" text-xs text-balance px-6 text-center *:[a]:hover:text-primary text-muted-foreground *:[a]:underline *:[a]:underline-offetset-4">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và{" "}
        <a href="#">Chính sách bảo mật</a> của chúng tôi.
      </div>
    </div>
  )
}
