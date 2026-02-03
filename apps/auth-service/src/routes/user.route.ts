import {Router} from "fastify";
import supabase from "../utils/supabase.ts";

const router:Router = Router();

router.get("/", async (req, res) => {
    const users = await supabase.supabaseClient.users.getUserList();
    res.status(200).json(users);
});

router.get("/:id", async (req, res) => {
    const {id} = req.params as {id: string};
    const user = await supabase.supabaseClient.users.getUser(id);
    res.status(200).json(user);
    return { message: "User route is working!" };
});

router.post("/", async (req, res) => {
    type CreateParams = Parameters<typeof supabase.supabaseClient.users.createUser>[0];
    const newUser: CreateParams = req.body;
    const user = await supabase.supabaseClient.users.createUser(newUser);
    res.status(200).json(user);
    return { message: "User route is working!" };
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params as {id: string};
    const user = await supabase.supabaseClient.users.deleteUser(id);
    res.status(200).json(user);
    return { message: "User route is working!" };
});
export default router;