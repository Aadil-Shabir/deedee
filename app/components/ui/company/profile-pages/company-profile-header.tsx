"use client";

import { Globe, Calendar } from "lucide-react";
import Image from "next/image";
import { CompanyData } from "@/types/company";

interface CompanyProfileHeaderProps {
  company: CompanyData;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

export function CompanyProfileHeader({ company }: CompanyProfileHeaderProps) {
  const initials = getInitials(company.company_name);
  const joinDate = new Date(company.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="relative">
      <div className="h-48 sm:h-64 md:h-80 relative overflow-hidden">
        {company.cover_image_url ? (
          <Image
            src={company.cover_image_url}
            alt={`${company.company_name} cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "#2c104b" }}
          >
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>

        <div className="absolute -bottom-1 sm:-bottom-1 left-1/2 transform -translate-x-1/2 z-50">
          {company.logo_url ? (
            <div className="relative">
              <Image
                src={company.logo_url}
                alt={`${company.company_name} logo`}
                width={120}
                height={120}
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
            </div>
          ) : (
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl sm:text-4xl font-bold text-purple-600">
                {initials}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-10 sm:pt-12 pb-8 bg-zinc-900 border-b border-zinc-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">
              {company.company_name}
            </h1>

            {company.short_description && (
              <p className="text-lg sm:text-xl text-zinc-300 mb-6 max-w-3xl mx-auto leading-relaxed">
                {company.short_description}
              </p>
            )}

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                Company
              </span>
              <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm border border-purple-600/30">
                B2B
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
