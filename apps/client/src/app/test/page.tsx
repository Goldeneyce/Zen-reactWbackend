import { createSupabaseServerClient } from "@/lib/supabaseServer";

const TestPage = async () => {
    const supabase = await createSupabaseServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    console.log("Supabase token:", token);
    console.log(token);
    
    const resProduct = await fetch("http://localhost:8000/test", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const dataProduct = await resProduct.json();

    console.log("Data from product service:", dataProduct);

    const resOrder = await fetch("http://localhost:8001/test", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const dataOrder = await resOrder.json();

    console.log("Data from order service:", dataOrder);

    const resPayment = await fetch("http://localhost:8002/test", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const dataPayment = await resPayment.json();

    console.log("Data from payment service:", dataPayment);

  return (
    <div className=''>Page</div>
  )
}

export default TestPage;