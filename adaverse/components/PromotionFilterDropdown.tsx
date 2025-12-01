'use client';

import { useAdaPromotions } from "@/context/AdaPromotionsContext";
import { CombinedColors } from "@/content/Colors";

type PromotionFilterDropdownProps = {
  value: number | null;
  onChange: (promotionId: number | null) => void;
};

export function PromotionFilterDropdown({ value, onChange }: PromotionFilterDropdownProps) {
  const { listAdaPromotions } = useAdaPromotions();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val === '' ? null : parseInt(val, 10));
  };

  return (
    <select
      value={value === null ? '' : value.toString()}
      onChange={handleChange}
      className={`rounded-md border ${CombinedColors.border.default} ${CombinedColors.background.cardAlt} h-10 text-sm px-3 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500`}
    >
      <option value="">Toutes les promotions</option>
      {listAdaPromotions.map((promotion) => (
        <option key={promotion.id} value={promotion.id}>
          {promotion.promotionName}
        </option>
      ))}
    </select>
  );
}
