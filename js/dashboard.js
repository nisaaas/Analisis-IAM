async function cekLogin() {

    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {

        alert("Silakan login terlebih dahulu.");

        window.location.href = "index.html";

        return false;

    }

    return data.user;

}
async function loadDashboard() {

    const user = await cekLogin();

    if (!user) return;

    document.getElementById("email").textContent = user.email;

    const { data: profile, error } = await supabase

        .from("profiles")

        .select("nama, role")

        .eq("id", user.id)

        .single();

    if (error) {

        alert("Profil tidak ditemukan.");

        return;

    }

    document.getElementById("nama").textContent = profile.nama;

    document.getElementById("role").textContent = profile.role;

}

loadDashboard();

// async function loadDashboard() {

//     const { data, error } = await supabase.auth.getUser();

//     console.log("USER DATA =", data);
//     console.log("USER ERROR =", error);

//     if (error || !data.user) {
//         alert("Belum login");
//         return;
//     }

//     document.getElementById("email").textContent = data.user.email;

//     const { data: profile, error: profileError } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", data.user.id)
//         .single();

//     console.log("PROFILE =", profile);
//     console.log("PROFILE ERROR =", profileError);

//     if (profileError) {
//         alert(profileError.message);
//         return;
//     }

//     document.getElementById("nama").textContent = profile.nama;
//     document.getElementById("role").textContent = profile.role;
// }

// loadDashboard();

async function logout() {

    await supabase.auth.signOut();

    window.location.href = "index.html";

}

document

.getElementById("logoutBtn")

.addEventListener("click", logout);