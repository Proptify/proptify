'use client';
import React from 'react';
import Link from 'next/link';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const emojis = ['🏙️', '🌊', '🌿', '🏗️'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-gray-900 border border-amber-900/20 rounded-lg overflow-hidden hover:border-amber-500 transition cursor-pointer group">
        {/* Image */}
        <div className="h-40 bg-gradient-to-br from-amber-900/20 to-orange-900/20 flex items-center justify-center relative">
          <span className="text-5xl">{emoji}</span>
          <div className="absolute top-3 left-3 bg-black/70 px-3 py-1 rounded text-xs font-semibold text-amber-500">
            {property.property_type}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-white mb-1">{property.name}</h3>
          <p className="text-sm text-gray-400 mb-4">📍 {property.location}</p>

          <div className="flex justify-between items-center mb-3">
            <span className="text-xl font-bold text-amber-500">${property.price_per_token.toFixed(2)} / token</span>
            <span className="text-xs font-semibold bg-green-900/30 text-green-500 px-2 py-1 rounded">
              {property.apy}% APY
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-2 rounded-full transition-all"
              style={{ width: `${property.funded_percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{property.funded_percentage}% funded</span>
            <span>{property.total_tokens} tokens</span>
          </div>

          {/* CTA */}
          <button className="w-full mt-4 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-black text-amber-500 font-semibold py-2 rounded transition">
            Invest Now →
          </button>
        </div>
      </div>
    </Link>
  );
};
