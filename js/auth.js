async function requireAuth() {

    const { data } = await supabase.auth.getSession();

    if (!data.session) {

        window.location.replace("index.html");

        return null;

    }

    return data.session.user;

}