interface TimeLabelProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  isSelected?: boolean;
}

export const TimeLabel = ({
  children,
  isSelected,
  ...props
}: TimeLabelProps) => {
  return (
    <button
      className={`${
        isSelected
          ? 'border border-[#007AFF] bg-[#007AFF] text-white'
          : 'border border-[#gray-200] bg-gray-000 text-[#B1B1B1]'
      } w-fit cursor-pointer rounded-md px-2 py-1 text-[16px] transition-colors duration-200 ease-in-out hover:bg-[#0059FF] hover:text-white`}
      {...props}
    >
      {children}
    </button>
  );
};
