
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t bg-muted/40 mt-auto">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <div className="h-6 w-6">
                <svg viewBox="0 0 48 48" className="w-full h-full text-cog-teal fill-current">
                  <path d="M24.0002 6C21.5142 6 19.0617 6.3695 16.6902 7.084C16.1167 9.0345 14.9837 10.281 13.6257 11.031C12.2677 11.781 10.4387 12.287 8.66722 12.044C6.49122 15.159 5.10022 18.951 5.10022 23C5.10022 27.049 6.49122 30.841 8.66722 33.956C10.4387 33.713 12.2677 34.219 13.6257 34.969C14.9837 35.719 16.1167 36.966 16.6902 38.916C19.0617 39.63 21.5142 40 24.0002 40C26.4862 40 28.9402 39.63 31.3102 38.916C31.8837 36.966 33.0182 35.719 34.3762 34.969C35.7342 34.219 37.5602 33.713 39.3332 33.956C41.5092 30.841 42.9002 27.049 42.9002 23C42.9002 18.951 41.5092 15.159 39.3332 12.044C37.5602 12.287 35.7342 11.781 34.3762 11.031C33.0182 10.281 31.8837 9.0345 31.3102 7.084C28.9402 6.3695 26.4862 6 24.0002 6Z" className="opacity-20"/>
                  <path d="M24.0002 10.057C22.6262 10.057 21.2647 10.247 19.9452 10.614C19.8202 10.9705 19.6457 11.315 19.4262 11.63C18.4387 13.0355 16.9402 14.0125 15.3077 14.5065C14.7627 14.6575 14.2027 14.759 13.6407 14.802C12.2572 16.9915 11.4787 19.6235 11.4787 22.4515C11.4787 25.2795 12.2572 27.9115 13.6407 30.101C14.2027 30.144 14.7627 30.2455 15.3077 30.3965C16.9402 30.8905 18.4402 31.8645 19.4262 33.273C19.6457 33.5865 19.8202 33.9295 19.9452 34.2875C21.2647 34.656 22.6262 34.846 24.0002 34.846C25.3742 34.846 26.7342 34.656 28.0552 34.2875C28.1802 33.9295 28.3547 33.5865 28.5742 33.273C29.5602 31.8645 31.0602 30.8905 32.6927 30.3965C33.2377 30.2455 33.7977 30.144 34.3597 30.101C35.7432 27.9115 36.5217 25.2795 36.5217 22.4515C36.5217 19.6235 35.7432 16.9915 34.3597 14.802C33.7977 14.759 33.2377 14.6575 32.6927 14.5065C31.0602 14.0125 29.5602 13.0355 28.5742 11.63C28.3547 11.3165 28.1802 10.9705 28.0552 10.614C26.7342 10.245 25.3742 10.057 24.0002 10.057Z"/>
                  <path d="M24 16.85C25.0125 16.85 25.975 17.267 26.6125 17.917C27.25 18.567 27.66 19.545 27.66 20.572C27.66 21.6 27.25 22.577 26.6125 23.227C26.5375 23.304 26.46 23.374 26.3775 23.44C26.4025 23.682 26.415 23.927 26.415 24.177C26.415 26.335 25.0075 28.348 22.6625 30.193C22.79 30.361 22.8975 30.542 22.9775 30.736C23.125 31.096 23.2075 31.501 23.2075 31.934V36.062C23.2075 36.09 23.2125 36.114 23.2125 36.14C23.2125 36.88 23.2075 38.007 22.0775 38.612L19.76 39.82L19.76 39.82C19.165 40.107 18.5 39.999 18.0225 39.644C17.545 39.29 17.2675 38.7 17.2675 38.032V31.934C17.2675 31.501 17.35 31.096 17.4975 30.736C17.5775 30.542 17.685 30.361 17.8125 30.193C15.4675 28.348 14.06 26.335 14.06 24.177C14.06 23.927 14.0725 23.682 14.0975 23.44C14.015 23.374 13.9375 23.304 13.8625 23.227C13.225 22.577 12.815 21.6 12.815 20.572C12.815 19.545 13.225 18.567 13.8625 17.917C14.5 17.267 15.4625 16.85 16.475 16.85C18.3375 16.85 19.9325 18.227 20.1625 20.027C20.3875 19.987 20.6175 19.967 20.8525 19.967C21.0875 19.967 21.3175 19.987 21.5425 20.027C21.7725 18.227 23.3675 16.85 25.23 16.85H24Z"/>
                </svg>
              </div>
              <span className="font-display font-bold">Rewire</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              Supporting brain injury recovery through cognitive exercises and tracking
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end mt-4 md:mt-0">
            <div className="flex gap-6">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              © {new Date().getFullYear()} Rewire. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
