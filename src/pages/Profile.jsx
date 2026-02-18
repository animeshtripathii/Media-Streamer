
import React from 'react';

const Profile = () => {
    return (
        <div className="flex-1 p-8 text-white">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>
            <div className="flex items-center gap-6 mb-8">
                <div className="size-24 rounded-full overflow-hidden border-4 border-emerald-accent/30">
                    <img className="object-cover w-full h-full" alt="User Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlHYiaNIS0Oomu-zQ-DdXO0C59qD2J1IogN76Kpo95ODeiKlM5-UPSOPicv0joEMx9uK5Vocn6FfaHj60jA_VmEmKdMzscZZTcQCyQAkPGSm5LXpQI_cb4ab5670b27AFWbOG3ijg9tMfvbPINMSJxDwBDjB3ft3vVlJ0LUHBOzuIgFI4Al-rte50J-lHtreL81rRnJs9PTufDxng95oxz1HCd4VW7TTNjEv4GBHVZEtoHwfmA334zg7mGgwn8e3stR2YSoKspAAiQ" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold">User Name</h2>
                    <p className="text-emerald-text-secondary">@username • 1.2K subscribers</p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
