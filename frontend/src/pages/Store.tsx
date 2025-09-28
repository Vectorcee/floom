import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FloomHeader } from "@/components/FloomHeader";
import { BottomNavigation } from "@/components/BottomNavigation";
import { 
  ShoppingBag, 
  Shirt, 
  Ticket, 
  Sparkles,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Store() {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="min-h-screen bg-background pb-20">
      <FloomHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading mb-2">FUUM Store</h1>
            <p className="text-muted-foreground font-body">
              Get exclusive FUUM merchandise, NFTs, and IRL event tickets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* FUUM NFTs */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">FUUM NFTs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Exclusive digital collectibles for FUUM community members
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            {/* Merch Collections */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Shirt className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">Merch Collections</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Premium apparel and accessories for the FUUM community
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>

            {/* IRL Tickets */}
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
                  <Ticket className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-heading">FUUM IRL Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground font-body mb-4">
                  Exclusive access to FUUM events and meetups worldwide
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Coming Soon
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-8">
                <ShoppingBag className="h-16 w-16 text-primary mx-auto mb-4" />
                <h2 className="text-2xl font-heading mb-4">Store Opening Soon</h2>
                <p className="text-muted-foreground font-body max-w-md mx-auto">
                  We're preparing an amazing collection of exclusive FUUM items. 
                  Stay tuned for updates on our launch!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}