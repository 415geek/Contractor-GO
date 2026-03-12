"use client";

import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Star, 
  DollarSign, 
  Clock, 
  Users 
} from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  distance: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  rating: number;
  priceLevel: number;
  avgWaitTime: number;
  marketShare: number;
  popularItems: string[];
}

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
}

const CompetitiveAnalysis = () => {
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);

  const competitors: Competitor[] = [
    {
      id: '1',
      name: 'Burger Palace',
      distance: '0.5 miles',
      sentiment: 'positive',
      rating: 4.2,
      priceLevel: 2,
      avgWaitTime: 15,
      marketShare: 25,
      popularItems: ['Classic Burger', 'Fries', 'Milkshake']
    },
    {
      id: '2',
      name: 'Pizza Corner',
      distance: '0.8 miles',
      sentiment: 'neutral',
      rating: 3.8,
      priceLevel: 1,
      avgWaitTime: 12,
      marketShare: 18,
      popularItems: ['Pepperoni Pizza', 'Garlic Bread', 'Salad']
    }
  ];

  const marketInsights: MarketInsight[] = [
    {
      id: '1',
      title: 'Burger Demand Increase',
      description: 'Local burger demand has increased by 15% in the last quarter',
      trend: 'up',
      impact: 'high'
    },
    {
      id: '2',
      title: 'Vegetarian Options Popularity',
      description: 'Vegetarian menu items seeing 25% more orders',
      trend: 'up',
      impact: 'medium'
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-700';
      case 'negative': return 'bg-red-100 text-red-700';
      case 'neutral': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />;
      case 'stable': return <div className="h-3 w-3 text-gray-400">→</div>;
      default: return <div className="h-3 w-3 text-gray-400">→</div>;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
          Competitive Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Competitors List */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Nearby Competitors
            </h3>
            <div className="space-y-3">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{competitor.name}</h4>
                      <p className="text-sm text-gray-500">{competitor.distance} away</p>
                    </div>
                    <Badge className={getSentimentColor(competitor.sentiment)}>
                      {competitor.sentiment.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-amber-500 mr-1" />
                      <span>{competitor.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{'$'.repeat(competitor.priceLevel)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{competitor.avgWaitTime} min</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 text-gray-500 mr-1" />
                      <span>{competitor.marketShare}% share</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedCompetitor(
                        expandedCompetitor === competitor.id ? null : competitor.id
                      )}
                    >
                      {expandedCompetitor === competitor.id ? 'Hide' : 'Show'} Details
                    </Button>
                    <Progress value={competitor.marketShare} className="w-20 h-2" />
                  </div>

                  {expandedCompetitor === competitor.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium mb-2">Popular Items:</p>
                      <div className="space-y-1">
                        {competitor.popularItems.map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Market Insights */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
              Market Insights
            </h3>
            <div className="space-y-3">
              {marketInsights.map((insight) => (
                <div key={insight.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                    <div className="flex items-center">
                      {getTrendIcon(insight.trend)}
                      <Badge className={`ml-2 ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analysis
                  </Button>
                </div>
              ))}
            </div>

            {/* Market Summary */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
              <h4 className="font-semibold text-purple-600 mb-2">Market Position</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600/70">Your market share</p>
                  <p className="text-2xl font-bold text-purple-600">20%</p>
                </div>
                <div className="text-right">
                  <p className="极text-sm text-purple-600/70">Growth</p>
                  <p className="text-lg font-bold text-green-600">+5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitiveAnalysis;