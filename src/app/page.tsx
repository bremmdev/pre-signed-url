import Upload from "./components/Upload";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <h2 className="text-2xl font-bold my-4">Upload to Azure</h2>
      <Upload maxFileCount={3} provider="azure" />
      <h2 className="text-2xl font-bold my-4">Upload to AWS</h2>
      <Upload maxFileCount={3} provider="aws" />
    </main>
  );
}
