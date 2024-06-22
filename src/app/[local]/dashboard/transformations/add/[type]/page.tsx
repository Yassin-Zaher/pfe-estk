import Header from "@/app/[local]/dashboard/_components/shared/Header";
import TransformationForm from "@/app/[local]/dashboard/_components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const AddTransformationPage = async ({
  params: { type },
}: SearchParamProps) => {
  const user = await currentUser();

  const transformation = transformationTypes[type];

  if (!user.id) redirect("/sign-in");

  //const user = await getUserById(userId);
  return (
    <>
      <Header title="Title" subtitle="Subtitle" />
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user.id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={500}
        />
      </section>
    </>
  );
};

export default AddTransformationPage;
