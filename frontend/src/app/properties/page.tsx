'use client';
import React, { useEffect, useState } from 'react';
import { Property } from '../../types';
import { PropertyCard } from '../../components/PropertyCard';
import { propertiesAPI } from '../../lib/api';

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data: any = await propertiesAPI.list();
        setProperties(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Properties</h1>
        <p className="text-gray-400 text-lg">Invest in real estate across Africa and Southeast Asia</p>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-8 text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full" />
          </div>
          <p className="text-gray-400 mt-4">Loading properties...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 border border-amber-900/20 rounded-lg">
          <p className="text-gray-400 mb-4">No properties available yet</p>
          <p className="text-sm text-gray-500">Check back soon for new listings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
