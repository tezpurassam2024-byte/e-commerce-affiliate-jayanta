import React from 'react';
import { RecommendationWizard } from '../components/RecommendationWizard';

interface ProductFinderPageProps {
  onNavigate: (page: string, params?: Record<string, any>) => void;
}

export const ProductFinderPage: React.FC<ProductFinderPageProps> = ({ onNavigate }) => {
  return (
    <div id="product-finder-standalone-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <RecommendationWizard onNavigate={onNavigate} />
    </div>
  );
};
