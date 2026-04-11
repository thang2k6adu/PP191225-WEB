import { SortButtons } from '../components/SortButtons';
import {
  FilterGroup,
  CategoryFilter,
  SimpleFilter,
} from '../components/FilterComponents';
import {
  SORT_OPTIONS,
  CATEGORIES,
  STATUS_OPTIONS,
  PRICE_OPTIONS,
  CAPACITY_OPTIONS,
  ROOM_OPTIONS,
} from '../constants';

export function FilterSidebar() {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-h6-medium text-black">Sort by</span>
          <button className="text-caption-lg-regular text-[#7272D9]">
            Clear
          </button>
        </div>
        <SortButtons options={SORT_OPTIONS} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-h6-medium text-black">Filter by</span>
          <button className="text-caption-lg-regular text-[#7272D9]">
            Clear
          </button>
        </div>

        <div className="space-y-2">
          <FilterGroup title="Category">
            <CategoryFilter categories={CATEGORIES} />
          </FilterGroup>

          <FilterGroup title="Status">
            <SimpleFilter options={STATUS_OPTIONS} />
          </FilterGroup>

          <FilterGroup title="Price">
            <SimpleFilter options={PRICE_OPTIONS} />
          </FilterGroup>

          <FilterGroup title="Capacity">
            <SimpleFilter options={CAPACITY_OPTIONS} />
          </FilterGroup>

          <FilterGroup title="Room">
            <SimpleFilter options={ROOM_OPTIONS} />
          </FilterGroup>
        </div>
      </div>
    </div>
  );
}
