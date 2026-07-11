"use client";

export default function ProfileDropdownButton() {
  const handleDropDown = () => {
    const target = "show";
    const profileDropdown = document.querySelector("#_prfoile_drop");
    const isDropShow = profileDropdown?.classList.contains(target);
    if (!isDropShow) {
      profileDropdown?.classList.add(target);
    } else {
      profileDropdown?.classList.remove(target);
    }
  };

  return (
    <button
      id="_profile_drop_show_btn"
      className="_header_nav_dropdown_btn _dropdown_toggle"
      type="button"
      onClick={handleDropDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="6"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          fill="#112032"
          d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z"
        />
      </svg>
    </button>
  );
}
