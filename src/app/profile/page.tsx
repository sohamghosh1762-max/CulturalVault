"use client";

import { useEffect, useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
  name: "",
  email: "",
  image: "",
});

  const [stats, setStats] = useState({
  contributions: 0,
  likes: 0,
  views: 0,
  regions: 0,
  heritageScore: 0,
  streak: 0,
  leaderboardPosition: 1,
  rank: "Explorer",
});

  const [recentContributions, setRecentContributions] =
    useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const stored =
    localStorage.getItem("user_profile");

  if (stored) {
    const user =
      JSON.parse(stored);

    setProfile(user);

    fetchContributions(
      user.name
    );
  }
}, []);

  async function fetchContributions(
  userName: string
) {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/contributions"
      );

      const data = await res.json();
      const dataArray = Array.isArray(data) ? data : [];

      console.log("Profile Name:", userName);

console.log(
  "Contributors:",
  dataArray.map((x:any) => x.contributor)
);

const userContributions = dataArray.filter(
  (item: any) =>
    item.contributor?.trim().toLowerCase() ===
    userName?.trim().toLowerCase()
);

console.log(
  "User Contributions:",
  userContributions
);

      setRecentContributions(
  userContributions.slice(0, 5)
);

      const totalLikes =
  userContributions.reduce(
    (sum: number, item: any) =>
      sum + (item.likes || 0),
    0
  );

      const totalViews =
  userContributions.reduce(
    (sum: number, item: any) =>
      sum + (item.views || 0),
    0
  );

  const contributions =
  userContributions.length;


      let rank = "Explorer";

      if (contributions >= 30)
        rank =
          "Cultural Ambassador";
      else if (contributions >= 15)
        rank =
          "Heritage Guardian";
      else if (contributions >= 5)
        rank = "Story Keeper";

      const regions = new Set(
  userContributions.map(
    (item: any) => item.region
  )
).size;

const heritageScore =
  contributions * 10 +
  totalLikes * 2 +
  totalViews;

const streak =
  contributions > 0
    ? Math.min(
        contributions,
        30
      )
    : 0;

setStats({
  contributions,
  likes: totalLikes,
  views: totalViews,
  regions,
  heritageScore,
  streak,
  leaderboardPosition: 1,
  rank,
});
    } catch (error) {
  console.error(error);
} finally {
  setLoading(false);
}
  }

  return (
    <PageWrapper className="max-w-7xl mx-auto px-6 py-10">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-5xl font-bold">
          👤 Profile Dashboard
        </h1>

        <p className="text-muted-foreground mt-2">
          Track your heritage
          contributions and impact.
        </p>
      </div>

      {/* Profile Card */}

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="border rounded-3xl p-6">

          <div className="flex items-center gap-4">

  {profile.image ? (
    <img
      src={profile.image}
      alt="Profile"
      className="w-20 h-20 rounded-full object-cover border-4 border-orange-500"
    />
  ) : (
    <div className="w-20 h-20 rounded-full bg-orange-500/20 flex items-center justify-center text-3xl font-bold text-orange-500">
      {profile.name
  ? profile.name.charAt(0).toUpperCase()
  : "U"}
    </div>
  )}

  <div>
    <h2 className="text-3xl font-bold">
      {profile.name}
    </h2>

    <p className="text-muted-foreground">
      {profile.email}
    </p>
  </div>

</div>

<div className="mt-5">

  <label
    htmlFor="profilePhoto"
    className="cursor-pointer bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl inline-block"
  >
    📷 Upload Profile Photo
  </label>

  <input
    id="profilePhoto"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.onload = () => {
        const updatedProfile = {
          ...profile,
          image: reader.result as string,
        };

        setProfile(updatedProfile);

        localStorage.setItem(
          "user_profile",
          JSON.stringify(updatedProfile)
        );
      };

      reader.readAsDataURL(file);
    }}
  />

</div>

          <div className="mt-6">

            <h3 className="font-semibold">
              🏆 Heritage Rank
            </h3>

            <div className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-xl inline-block">
              {stats.rank}
            </div>

          </div>

          <div className="mt-5 border rounded-2xl p-4">

  <h3 className="font-semibold">
    🏆 Community Rank
  </h3>

  <p className="text-4xl font-bold mt-2">
    #{stats.leaderboardPosition}
  </p>

</div>

          <div className="mt-6">

            <div className="flex justify-between mb-2">
              <span>
                Next Rank Progress
              </span>

              <span>
                {Math.min(
                  stats.contributions * 10,
                  100
                )}
                %
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-orange-500 h-3 rounded-full"
                style={{
                  width: `${Math.min(
                    stats.contributions * 10,
                    100
                  )}%`,
                }}
              />
            </div>

          </div>

        </div>

        {/* Stats */}

        <div className="lg:col-span-2">

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-5">

            <div className="border rounded-3xl p-6 text-center">
  <h3 className="text-4xl font-bold">
    {stats.regions}
  </h3>

  <p className="text-muted-foreground mt-2">
    Regions
  </p>
</div>

<div className="border rounded-3xl p-6 text-center">
  <h3 className="text-4xl font-bold">
    {stats.heritageScore}
  </h3>

  <p className="text-muted-foreground mt-2">
    Heritage Score
  </p>
</div>

<div className="border rounded-3xl p-6 text-center">
  <h3 className="text-4xl font-bold">
    🔥 {stats.streak}
  </h3>

  <p className="text-muted-foreground mt-2">
    Streak
  </p>
</div>

            <div className="border rounded-3xl p-6 text-center">
              <h3 className="text-4xl font-bold">
                {stats.contributions}
              </h3>

              <p className="text-muted-foreground mt-2">
                Contributions
              </p>
            </div>

            <div className="border rounded-3xl p-6 text-center">
              <h3 className="text-4xl font-bold">
                {stats.likes}
              </h3>

              <p className="text-muted-foreground mt-2">
                Total Likes
              </p>
            </div>

            <div className="border rounded-3xl p-6 text-center">
              <h3 className="text-4xl font-bold">
                {stats.views}
              </h3>

              <p className="text-muted-foreground mt-2">
                Total Views
              </p>
            </div>

          </div>

          {/* Achievements */}

          <div className="border rounded-3xl p-6 mt-6">

            <h2 className="text-2xl font-bold mb-5">
              🏅 Achievements
            </h2>

            <div className="flex flex-wrap gap-3">

  {stats.contributions >= 1 && (
    <span className="bg-orange-500 text-white px-4 py-2 rounded-full">
      🏛 Cultural Explorer
    </span>
  )}

  {stats.contributions >= 5 && (
    <span className="bg-blue-500 text-white px-4 py-2 rounded-full">
      📖 Story Keeper
    </span>
  )}

  {stats.contributions >= 15 && (
    <span className="bg-green-500 text-white px-4 py-2 rounded-full">
      🌍 Heritage Guardian
    </span>
  )}

  {stats.contributions >= 30 && (
    <span className="bg-purple-500 text-white px-4 py-2 rounded-full">
      👑 Cultural Ambassador
    </span>
  )}

</div>

          </div>

        </div>

      </div>

      {/* Recent Contributions */}

      <div className="border rounded-3xl p-6 mt-8">

        <h2 className="text-3xl font-bold mb-6">
          📚 Recent Contributions
        </h2>

        <div className="space-y-4">

          {recentContributions.map(
            (item) => (
              <div
                key={item._id}
                className="border rounded-2xl p-4"
              >
                <h3 className="font-bold text-xl">
                  {item.title}
                </h3>

                <p className="text-muted-foreground">
                  {item.category}
                </p>

                <div className="flex gap-4 mt-2 text-sm">
                  <span>
                    ❤️ {item.likes || 0}
                  </span>

                  <span>
                    👁 {item.views || 0}
                  </span>
                </div>
              </div>
            )
          )}

        </div>

      </div>

    </PageWrapper>
  );
}