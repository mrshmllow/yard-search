export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = searchParams["query"] !== undefined && !Array.isArray(searchParams["query"]) ? searchParams["query"] : "";
  const data = {
  };

  return (
    <main className="">
      <h1>yard-search</h1>

      <form>
        <input name="query" defaultValue={query}></input>
        <button type="submit">Search</button>
      </form>
    </main>
  );
}
