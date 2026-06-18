"use client";

import {
  Shield,
  Globe,
  AlertTriangle,
  Users,
  LogOut,
  UserCircle,
  LayoutDashboard,
  Compass,
  MessageSquare,
  User,
  Bookmark,
  ShieldAlert,
  ScrollText,
  Mic,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const router = useRouter();

  const [adminName, setAdminName] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [sites, setSites] = useState<any[]>([]);

  const [newSite, setNewSite] = useState({
  name: "",
  country: "",
  risk: "Low",
  score: "",
  reason: "",
  lat: "",
  lng: "",
});


  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");

    if (!isAdmin) {
      router.push("/admin/login");
      return;
    }

    const storedAdmin =
      localStorage.getItem("adminAccount");

    if (storedAdmin) {
      const admin = JSON.parse(storedAdmin);
      setAdminName(admin.name);
    }

    const storedSites =
      localStorage.getItem("heritageSites");

    if (storedSites) {
      setSites(JSON.parse(storedSites));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    router.push("/admin/login");
  };

  const handleDeleteSite = (id: number) => {
  const updatedSites = sites.filter(
    (site) => site.id !== id
  );

  setSites(updatedSites);

  localStorage.setItem(
    "heritageSites",
    JSON.stringify(updatedSites)
  );
};

const handleEditSite = (site: any) => {
  setEditingId(site.id);

  setNewSite({
  name: site.name,
  country: site.country,
  risk: site.risk,
  score: String(site.score || ""),
  reason: site.reason || "",
  lat: String(site.lat),
  lng: String(site.lng),
});
};


  const handleAddSite = () => {
    if (!newSite.name || !newSite.country) {
      alert("Please fill all fields");
      return;
    }

    const updatedSites = [
  ...sites,
  {
  id: Date.now(),
  name: newSite.name,
  country: newSite.country,
  risk: newSite.risk,
  score: Number(newSite.score),
  reason: newSite.reason,
  lat: Number(newSite.lat),
  lng: Number(newSite.lng),
},
];

    setSites(updatedSites);

    localStorage.setItem(
      "heritageSites",
      JSON.stringify(updatedSites)
    );

    setNewSite({
  name: "",
  country: "",
  risk: "Low",
  score: "",
  reason: "",
  lat: "",
  lng: "",
});
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Shield
            className="text-primary"
            size={34}
          />

          <div>
            <h1 className="text-4xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-muted-foreground">
              Manage CulturalVault heritage data
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {/* Admin Profile */}
      <div className="border rounded-2xl p-6 mb-8 bg-card">
        <div className="flex items-center gap-4">
          <UserCircle
            size={60}
            className="text-primary"
          />

          <div>
            <h2 className="text-xl font-bold">
              {adminName || "Administrator"}
            </h2>

            <p className="text-muted-foreground">
              CulturalVault System Administrator
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <div className="border rounded-2xl p-6 bg-card">
          <Globe className="mb-4 text-primary" />

          <h3>Total Sites</h3>

          <p className="text-3xl font-bold">
            {sites.length}
          </p>
        </div>

        <div className="border rounded-2xl p-6 bg-card">
          <AlertTriangle className="mb-4 text-red-500" />

          <h3>High Risk</h3>

          <p className="text-3xl font-bold">
            {
              sites.filter(
                (site) => site.risk === "High"
              ).length
            }
          </p>
        </div>

        <div className="border rounded-2xl p-6 bg-card">
          <Users className="mb-4 text-blue-500" />

          <h3>Visitors</h3>

          <p className="text-3xl font-bold">
            12K
          </p>
        </div>

        <div className="border rounded-2xl p-6 bg-card">
          <Shield className="mb-4 text-green-500" />

          <h3>Protected Sites</h3>

          <p className="text-3xl font-bold">
            {
              sites.filter(
                (site) => site.risk !== "High"
              ).length
            }
          </p>
        </div>
      </div>

      {/* User Features Quick Access Panel */}
      <div className="border rounded-2xl p-6 mb-10 bg-card/60 backdrop-blur-md shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-foreground">
          <Compass className="text-primary" size={24} />
          User Features & Explorer Panel
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          Quickly navigate to standard explorer pages and user-facing features.
        </p>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Dashboard", desc: "View explorer stats & suggestions", href: "/dashboard", icon: LayoutDashboard, color: "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20" },
            { label: "Explore Library", desc: "Browse cultural heritage registry", href: "/explore", icon: Compass, color: "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20" },
            { label: "AI Chat Support", desc: "Ask questions to AI guide", href: "/chat", icon: MessageSquare, color: "text-green-500 bg-green-500/10 hover:bg-green-500/20" },
            { label: "User Profile", desc: "Manage your user profile", href: "/profile", icon: User, color: "text-purple-500 bg-purple-500/10 hover:bg-purple-500/20" },
            { label: "Bookmarks", desc: "Access saved cultural items", href: "/bookmarks", icon: Bookmark, color: "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20" },
            { label: "Risk Dashboard", desc: "Monitor heritage status", href: "/risk-map", icon: ShieldAlert, color: "text-red-500 bg-red-500/10 hover:bg-red-500/20" },
            { label: "Stories", desc: "Read heritage articles", href: "/stories", icon: ScrollText, color: "text-indigo-500 bg-indigo-500/10 hover:bg-indigo-500/20" },
            { label: "Oral Story", desc: "Record oral history stories", href: "/oral-story", icon: Mic, color: "text-teal-500 bg-teal-500/10 hover:bg-teal-500/20" },
          ].map((feat, index) => {
            const Icon = feat.icon;
            return (
              <Link 
                key={index}
                href={feat.href}
                className="flex items-start gap-4 p-4 rounded-xl border border-border bg-background/50 hover:bg-secondary/40 hover:border-primary/50 transition-all duration-300 group shadow-sm hover:shadow"
              >
                <div className={`p-2.5 rounded-lg ${feat.color} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                    {feat.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Heritage Site Management */}
      <div className="border rounded-2xl p-6 bg-card">
        <h2 className="text-2xl font-bold mb-4">
          Heritage Site Management
        </h2>

        <p className="text-muted-foreground mb-6">
          Add and manage cultural heritage sites.
        </p>

        <div className="grid md:grid-cols-5 gap-4 mb-6">
          <input
            type="text"
            placeholder="Site Name"
            value={newSite.name}
            onChange={(e) =>
              setNewSite({
                ...newSite,
                name: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3 bg-background"
          />

          <input
            type="text"
            placeholder="Country"
            value={newSite.country}
            onChange={(e) =>
              setNewSite({
                ...newSite,
                country: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3 bg-background"
          />

          <input
  type="number"
  step="any"
  placeholder="Latitude"
  value={newSite.lat}
  onChange={(e) =>
    setNewSite({
      ...newSite,
      lat: e.target.value,
    })
  }
  className="border rounded-xl px-4 py-3 bg-background"
/>

<input
  type="number"
  step="any"
  placeholder="Longitude"
  value={newSite.lng}
  onChange={(e) =>
    setNewSite({
      ...newSite,
      lng: e.target.value,
    })
  }
  className="border rounded-xl px-4 py-3 bg-background"
/>

<input
  type="number"
  placeholder="Risk Score (0-100)"
  value={newSite.score}
  onChange={(e) =>
    setNewSite({
      ...newSite,
      score: e.target.value,
    })
  }
  className="border rounded-xl px-4 py-3 bg-background"
/>

<input
  type="text"
  placeholder="Risk Reason"
  value={newSite.reason}
  onChange={(e) =>
    setNewSite({
      ...newSite,
      reason: e.target.value,
    })
  }
  className="border rounded-xl px-4 py-3 bg-background"
/>

          <select
            value={newSite.risk}
            onChange={(e) =>
              setNewSite({
                ...newSite,
                risk: e.target.value,
              })
            }
            className="border rounded-xl px-4 py-3 bg-background"
          >
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>
        </div>

        <button
          onClick={() => {
  if (editingId) {
    const updatedSites = sites.map((site) =>
      site.id === editingId
  ? {
      ...site,
      name: newSite.name,
      country: newSite.country,
      risk: newSite.risk,
      score: Number(newSite.score),
      reason: newSite.reason,
      lat: Number(newSite.lat),
      lng: Number(newSite.lng),
    }
        : site
    );

    setSites(updatedSites);

    localStorage.setItem(
      "heritageSites",
      JSON.stringify(updatedSites)
    );

    setEditingId(null);

    setNewSite({
  name: "",
  country: "",
  risk: "Low",
  score: "",
  reason: "",
  lat: "",
  lng: "",
});
  } else {
    handleAddSite();
  }
}}
          className="bg-primary text-white px-5 py-3 rounded-xl hover:opacity-90"
        >
          {editingId
  ? "Update Heritage Site"
  : "Add Heritage Site"}
        </button>

        {/* Site List */}
        <div className="mt-8 space-y-4">
          {sites.map((site) => (
  <div
    key={site.id}
    className="border rounded-xl p-4 flex justify-between items-center"
  >
    <div>
      <h3 className="font-semibold">
        {site.name}
      </h3>

      <p className="text-sm text-muted-foreground">
        {site.country}
      </p>

      <p className="text-xs text-muted-foreground">
  Score: {site.score}
</p>

<p className="text-xs text-muted-foreground">
  {site.reason}
</p>
    </div>

    <div className="flex items-center gap-2">
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          site.risk === "High"
            ? "bg-red-100 text-red-600"
            : site.risk === "Medium"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-600"
        }`}
      >
        {site.risk}
      </span>

      <button
        onClick={() => handleEditSite(site)}
        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
      >
        Edit
      </button>

      <button
        onClick={() => handleDeleteSite(site.id)}
        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
      >
        Delete
      </button>
    </div>
  </div>
))}
        </div>
      </div>
    </div>
  );
}