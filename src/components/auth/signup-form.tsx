import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { format } from "date-fns";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/useAuthStore";
import * as z from "zod";

// Schema validate zod

const signUpSchema = z.object({
  lastname: z.string().min(1, "Họ không được để trống"),
  firstname: z.string().min(1, "Tên không được để trống"),
  username: z.string().min(6, "Tên đăng nhập phải >= 6 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải >= 6 ký tự"),
  gender: z.enum(["male", "female", "other"], "Chọn giới tính"),
  birth: z.date({
    error: "Vui lòng chọn ngày sinh"
  })
});

type SignUpFormValues = z.infer<typeof signUpSchema>;


export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      lastname: "",
      firstname: "",
      username: "",
      email: "",
      password: "",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      gender: "" as any,
      birth: undefined,
    }
  });

  const birth = watch("birth");
  const gender = watch("gender");

  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const onSubmit: SubmitHandler<SignUpFormValues> = async (data: SignUpFormValues) => {
    const submitData = {
      ...data,
      birth: format(data.birth, "yyyy-MM-dd"),
    };
    const { firstname, lastname, username, email, password, gender, birth } = submitData;
    await signUp(username, password, email, firstname, lastname, gender, birth);
    navigate('/signin');
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              {/* header */}

              <div className="flex flex-col items-center text-center gap-2">
                <a href="/" className="mx-auto block w-fit text-center">
                </a>
                <h1 className="text-2xl font-bold">Tạo tài khoản</h1>
                <p className="text-muted-foreground text-balance">Chào mừng bạn! Hãy đăng ký để tiếp tục</p>
              </div>

              {/* họ tên */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor='lastname' className='block text-sm'>
                    Họ
                  </Label>
                  <Input type='text' id='lastname' placeholder='Nguyen Van' {...register("lastname")} />
                  {errors.lastname && (
                    <p className="text-destructive text-sm">
                      {errors.lastname.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor='firstname' className='block text-sm'>
                    Tên
                  </Label>
                  <Input type='text' id='firstname' placeholder='Ay' {...register("firstname")} />
                  {errors.firstname && (
                    <p className="text-destructive text-sm">
                      {errors.firstname.message}
                    </p>
                  )}
                </div>
              </div>
              {/* username */}
              <div className="flex flex-col gap-3">
                <Label htmlFor='username' className='block text-sm'>
                  Tên đăng nhập
                </Label>
                <Input type='text' id='username' placeholder='user1' {...register("username")} />
                {errors.username && (
                  <p className="text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>
              {/* email */}
              <div className="flex flex-col gap-3">
                <Label htmlFor='email' className='block text-sm'>
                  Email
                </Label>
                <Input type='email' id='email' placeholder='user1@mail.vn' {...register("email")} />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
              {/* password */}
              <div className="flex flex-col gap-3">
                <Label htmlFor='password' className='block text-sm'>
                  Mật khẩu
                </Label>
                <Input type='password' id='password' placeholder='Nhập mật khẩu' {...register("password")} />
                {errors.password && (
                  <p className="text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
              {/* giới tính, ngày sinh */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor='gender' className='block text-sm'>
                    Giới tính
                  </Label>
                  <Select value={gender} onValueChange={(v: "male" | "female") => setValue('gender', v)}>{/* className="w-full max-w-xs md:max-w-sm" */}
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && (
                    <p className="text-destructive text-sm">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor='birth' className='block text-sm'>
                    Ngày sinh
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="font-normal w-full max-w-xs md:max-w-sm justify-between"
                      >
                        {birth ? format(birth, "dd/MM/yyyy") : "Chọn ngày"}
                        {/* <ChevronDownIcon /> */}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-auto max-w-xs md:max-w-sm" align="start">
                      <Calendar
                        mode="single"
                        selected={birth}
                        captionLayout="dropdown"
                        onSelect={(date) => date && setValue('birth', date)}

                      />
                    </PopoverContent>
                  </Popover>
                  {errors.birth && (
                    <p className="text-destructive text-sm">
                      {errors.birth.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Button */}
              <Button
                type='submit'
                className='w-full'>
                Đăng ký
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Bạn đã có tài khoản? {" "}
                <a
                  href="/signin"
                  className="underline underline-offset-4 hover:text-primary"
                >Đăng nhập</a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholderSignUp.png"
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
