export default function TimelineDropdownButton() {
  const handleDropDown = () => {
    const target = "show";
    const profileDropdown = document.querySelector("#_timeline_drop");
    const isDropShow = profileDropdown?.classList.contains(target);
    if (!isDropShow) {
      profileDropdown?.classList.add(target);
    } else {
      profileDropdown?.classList.remove(target);
    }
  };

  return (
    <button
      type="button"
      id="_timeline_show_drop_btn"
      className="_feed_timeline_post_dropdown_link"
      onClick={handleDropDown}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="4"
        height="17"
        fill="none"
        viewBox="0 0 4 17"
      >
        <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
        <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
        <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
      </svg>
    </button>
  );
}
