"use client";
import React, { useEffect, useState } from "react";
import { createDiyValues, Option, PictureValues } from "../../../types";
import {
  createDiy,
  clearState,
} from "../../../redux/features/projectSlice/createSlice";
import Image from "next/image";
import { InputField } from "@/app/components/InputField";
import { IoCamera } from "react-icons/io5";
import { ProfilePic } from "@/app/components/ProfilePic";
import {
  RootState,
  useAppSelector,
  useAppDispatch,
} from "../../../redux/store";
import { redirect } from "next/navigation";
import { useForm, SubmitHandler, Control } from "react-hook-form";
import { MdOutlineCancel } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TextAreaField } from "@/app/components/TextAreaField";
import { SelectField } from "@/app/components/SelectField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ImSpinner2 } from "react-icons/im";

const Create = () => {
  const dispatch = useAppDispatch();
  const [picturePreview, setPicturePreview] = useState<string>();
  const { isSuccess, isError, errorMessage, isFetching } = useAppSelector(
    (state: RootState) => state.createPost
  );
  const { token } = useAppSelector((state: RootState) => state.login);
  const { confirmedName } = useAppSelector((state: RootState) => state.signup);
  const userInitials =
    "flex justify-center items-center bg-amber-950 w-10 h-10 rounded-full text-gray-200 text-xl";
  const FILE_SIZE = 160 * 1024;
  const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/png",
  ];

  const categories = [
    {
      id: "Home Decor",
      name: "Home Decor",
    },
    {
      id: "Crafts",
      name: "Crafts",
    },
    { id: "Woodworking", name: "Woodworking" },
    {
      id: "Diy Gifts",
      name: "Diy Gifts",
    },
    {
      id: "Organization and Storage",
      name: "Organization and Storage",
    },
    {
      id: "Fashion and Accessories",
      name: "Fashion and Accessories",
    },
    {
      id: "Art and Design",
      name: "Art and Design",
    },
    {
      id: "Tech and Gadgets",
      name: "Tech and Gadgets",
    },
    {
      id: "Health and Wellness",
      name: "Health and Wellness",
    },
    {
      id: "Others",
      name: "Others",
    },
  ];

  const schema = yup
    .object({
      title: yup
        .string()
        .required("A title is required")
        .min(3, "Should contain minimum of 8 characters")
        .max(100, "Should contain maximum of 100 characters"),
      content: yup.string().required("Content can't be blank"),
      categories: yup.mixed<Option>().required("Please select a category"),
      picture: yup
        .mixed<PictureValues>()
        .required("A file is required")
        .test("fileSize", "File too large", (value) => {
          console.log(value);
          return value && value?.size <= FILE_SIZE ? true : false;
        })
        .test("fileFormat", "Unsupported File Format", (value) =>
          value && SUPPORTED_FORMATS.includes(value?.type) ? true : false
        ),
    })
    .required();

  const {
    watch,
    control,
    setValue,
    getValues,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const content = watch("content");
  const onSubmit: SubmitHandler<createDiyValues> = (
    data: createDiyValues,
    e
  ) => {
    e?.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("categories", (data.categories as Option).name);
    formData.append("picture", data.picture as Blob);
    console.log("Picture", data.picture);

    dispatch(createDiy(formData));
    reset();
    setPicturePreview("");
  };

  const handleImagePreview = (e: React.SyntheticEvent<EventTarget>) => {
    const file = (e.target as HTMLFormElement).files[0];
    // console.log("File", (e.target as HTMLFormElement).files);

    const urlImage = URL.createObjectURL(file);

    setPicturePreview(urlImage);
  };

  useEffect(() => {
    return () => {
      if (!token) {
        redirect("/login");
      }
      dispatch(clearState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("User created successfully.");
      reset();
      dispatch(clearState());
    } else if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [dispatch, errorMessage, isError, isSuccess, reset]);

  return (
    <>
      <div className="flex bg-gradient-to-br from-amber-500 via-auth-100 to-amber-900 h-screen fixed right-0 left-0">
        <ToastContainer position="top-right" />
        <div className="container mx-auto max-w-2xl mt-20 bg-white shadow-lg shadow-neutral-600 backdrop-blur-2xl rounded p-5 pt-6 h-[35rem] max-h-full overflow-scroll">
          <div className="flex items-center space-x-3 mb-9">
            <ProfilePic name={confirmedName} userInitials={userInitials} />
            <p>{confirmedName}</p>
          </div>
          <div className="pt-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputField
                type="text"
                control={control}
                registration={{ ...register("title") }}
                hasError={errors.title}
                errorMessage={errors.title?.message}
                placeholder="What's your title?"
                isRequired
                className="bg-transparent border-0 border-b rounded-none"
              />
              <TextAreaField
                id="message"
                placeholder="Share your DIY"
                value={content}
                registration={{ ...register("content") }}
                errorMessage={errors.content?.message}
                hasError={errors.content}
                isRequired
                className="mb-1 mt-2 border-gray-150 text-gray-950 placeholder-gray-150"
              />
              <SelectField
                name="categories"
                placeholder="Select a category"
                control={control as unknown as Control}
                arr={categories}
                errorMessage={errors.categories?.message}
                hasError={errors.categories}
                className="my-3 max-w-4xl"
              />
              {picturePreview && (
                <div className="relative border-8 border-gray-50 shadow-xl backdrop-blur-2xl">
                  <MdOutlineCancel
                    className="absolute -right-3 -top-3 text-xl text-red-700 cursor-pointer"
                    onClick={() => {
                      setPicturePreview("");
                      setValue("picture", {
                        ...getValues("picture"),
                        name: "",
                      });
                    }}
                  />
                  <Image
                    src={picturePreview}
                    alt="Image upload"
                    width={800}
                    height={300}
                  />
                </div>
              )}
              <div className="flex justify-end items-center space-x-3 pt-3">
                <InputField
                  label={
                    <span className="flex items-center space-x-2 bg-gray-200 rounded p-2 cursor-pointer">
                      <IoCamera className="inline-block text-lg" />
                      <span>Add an image</span>
                    </span>
                  }
                  type="file"
                  control={control}
                  registration={{ ...register("picture") }}
                  hasError={errors.picture}
                  errorMessage={errors.picture?.message}
                  handleImagePreview={handleImagePreview}
                  accept={"image/*"}
                  isRequired
                  hide="hidden"
                />
                <button
                  type="submit"
                  className="flex justify-center items-center space-x-3 bg-gradient-to-br from-rose-500 to-amber-700 hover:bg-gradient-to-br hover:from-amber-600 hover:to-rose-600 py-2 px-5 rounded text-white"
                >
                  {isFetching && (
                    <ImSpinner2 className="animate-spin text-xl" />
                  )}
                  <span>Post</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
