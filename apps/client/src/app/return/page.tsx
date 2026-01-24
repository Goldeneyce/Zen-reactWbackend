const ReturnPage = async ({searchParams}: {searchParams: Promise<{session_id:string}>  | undefined;
}) => {

    const session_id = (await searchParams)?.session_id

    if(!session_id){
        return <div>No session ID found!.</div>;
    }

    const res = await fetch(`http://localhost:8002/session`);

    if(!res.ok){
        return <div>Failed to fetch session data.</div>;
    }

  return <div>Return Page</div>;
}

export default ReturnPage;