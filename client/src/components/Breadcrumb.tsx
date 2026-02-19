import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const [location] = useLocation();
  
  // Generate breadcrumbs automatically if not provided
  const breadcrumbItems = items || generateBreadcrumbs(location);

  return (
    <nav className="bg-gray-50 py-2 px-4 sm:px-6 border-b" aria-label="Breadcrumb">
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link 
              href="/" 
              className="flex items-center text-gray-500 hover:text-ergo-red transition-colors"
              aria-label="Zur Startseite"
            >
              <Home className="w-4 h-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {breadcrumbItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-gray-500 hover:text-ergo-red transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-ergo-red font-medium" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

function generateBreadcrumbs(location: string): BreadcrumbItem[] {
  const pathSegments = location.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  if (pathSegments.length === 0) return [];

  if (pathSegments[0] === 'versicherung' && pathSegments[1]) {
    const insuranceTypes: Record<string, string> = {
      'hausrat': 'Hausratversicherung',
      'haftpflicht': 'Haftpflichtversicherung', 
      'wohngebaeude': 'Wohngebäudeversicherung',
      'rechtsschutz': 'Rechtsschutzversicherung',
      'zahnzusatz': 'Zahnzusatzversicherung'
    };

    breadcrumbs.push(
      { label: 'Versicherungen', href: '/' },
      { label: insuranceTypes[pathSegments[1]] || pathSegments[1] }
    );
  } else if (pathSegments[0] === 'leben-vorsorge') {
    breadcrumbs.push(
      { label: 'Versicherungen', href: '/' },
      { label: 'Leben & Vorsorge' }
    );
  } else {
    // Generic breadcrumb generation
    pathSegments.forEach((segment, index) => {
      const isLast = index === pathSegments.length - 1;
      const href = isLast ? undefined : '/' + pathSegments.slice(0, index + 1).join('/');
      
      breadcrumbs.push({
        label: capitalize(segment),
        href
      });
    });
  }

  return breadcrumbs;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}