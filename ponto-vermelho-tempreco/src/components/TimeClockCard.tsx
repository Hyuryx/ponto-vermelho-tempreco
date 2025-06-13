
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Clock, MapPin, Wifi, WifiOff, Coffee, LogIn, LogOut, Utensils, Navigation, Info } from "lucide-react";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useGeolocation } from "@/hooks/useGeolocation";
import { cn } from "@/lib/utils";

interface TimeClockCardProps {
  currentUser: {
    id: string;
    name: string;
    role: string;
    company: string;
  };
}

export const TimeClockCard = ({ currentUser }: TimeClockCardProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  
  const timeTracking = useTimeTracking(currentUser);
  const { getTodayEntry, clockIn, lunchOut, lunchIn, clockOut, calculateHours, workHours } = timeTracking;
  const location = useGeolocation();
  const todayEntry = getTodayEntry();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusBadge = () => {
    switch (todayEntry.status) {
      case 'not-started':
        return <Badge variant="secondary">Não iniciado</Badge>;
      case 'clocked-in':
        return <Badge className="bg-green-100 text-green-800">Trabalhando</Badge>;
      case 'lunch-break':
        return <Badge className="bg-yellow-100 text-yellow-800">Almoço</Badge>;
      case 'lunch-return':
        return <Badge className="bg-blue-100 text-blue-800">Retornou do almoço</Badge>;
      case 'clocked-out':
        return <Badge className="bg-gray-100 text-gray-800">Finalizado</Badge>;
    }
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(Math.abs(hours));
    const m = Math.floor((Math.abs(hours) - h) * 60);
    const sign = hours < 0 ? '-' : '';
    return `${sign}${h}h ${m}m`;
  };

  const getHoursBalance = () => {
    const { totalHours } = calculateHours(todayEntry);
    const dailyBalance = totalHours - workHours.dailyHours;
    const totalBalance = todayEntry.accumulatedBalance + dailyBalance;
    return totalBalance;
  };

  const getBalanceColor = () => {
    const balance = getHoursBalance();
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getBalanceLabel = () => {
    const balance = getHoursBalance();
    return balance >= 0 ? 'Horas Extras' : 'Horas Negativas';
  };

  // Função para confirmar saída
  const handleClockOutConfirmation = () => {
    setShowExitConfirmation(false);
    clockOut();
  };

  // Função para obter as configurações do botão único baseado no status
  const getButtonConfig = () => {
    console.log('Current status:', todayEntry.status);
    console.log('Today entry:', todayEntry);
    
    switch (todayEntry.status) {
      case 'not-started':
        return {
          onClick: clockIn,
          disabled: false,
          icon: LogIn,
          label: "ENTRADA",
          color: "bg-green-600 hover:bg-green-700"
        };
      case 'clocked-in':
        return {
          onClick: lunchOut,
          disabled: false,
          icon: Utensils,
          label: "ALMOÇO",
          color: "bg-yellow-600 hover:bg-yellow-700"
        };
      case 'lunch-break':
        return {
          onClick: lunchIn,
          disabled: false,
          icon: Coffee,
          label: "RETORNO",
          color: "bg-blue-600 hover:bg-blue-700"
        };
      case 'lunch-return':
        return {
          onClick: () => setShowExitConfirmation(true),
          disabled: false,
          icon: LogOut,
          label: "SAÍDA",
          color: "bg-red-600 hover:bg-red-700"
        };
      case 'clocked-out':
        return {
          onClick: clockIn,
          disabled: false,
          icon: LogIn,
          label: "NOVA ENTRADA",
          color: "bg-green-600 hover:bg-green-700"
        };
      default:
        return {
          onClick: clockIn,
          disabled: false,
          icon: LogIn,
          label: "ENTRADA",
          color: "bg-green-600 hover:bg-green-700"
        };
    }
  };

  const buttonConfig = getButtonConfig();
  const Icon = buttonConfig.icon;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Registro de Ponto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-lg text-gray-600">
                {currentTime.toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600">Offline</span>
                  </>
                )}
              </div>
              {getStatusBadge()}
            </div>

            {/* Informações de localização */}
            <div className="border rounded-lg p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">Localização</span>
              </div>
              
              {location.loading ? (
                <div className="text-sm text-gray-600">Obtendo localização...</div>
              ) : location.error ? (
                <div className="text-sm text-red-600">{location.error}</div>
              ) : (
                <div className="space-y-1">
                  <div className="text-sm text-gray-800 font-medium">
                    {location.address}
                  </div>
                  <div className="text-xs text-gray-600">
                    {location.city}, {location.country}
                  </div>
                </div>
              )}
            </div>

            {/* Botão único circular para registro de ponto */}
            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={buttonConfig.onClick}
                disabled={buttonConfig.disabled}
                className={cn(
                  "w-32 h-32 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed",
                  buttonConfig.color
                )}
              >
                <Icon className="w-10 h-10 mb-2" />
                <span className="text-sm font-bold">{buttonConfig.label}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Resumo do Dia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Informações sobre jornada de trabalho baseada nas configurações */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-sm text-blue-800">Jornada de Trabalho</span>
              </div>
              <div className="text-sm text-blue-700">
                <div>• Horas obrigatórias: <span className="font-semibold">{workHours.dailyHours}h</span></div>
                <div>• Intervalo para almoço: <span className="font-semibold">{workHours.lunchDuration}min</span></div>
                <div>• Total do dia: <span className="font-semibold">{workHours.dailyHours + (workHours.lunchDuration/60)}h</span></div>
                <div>• Dias de trabalho: <span className="font-semibold">{workHours.workingDays.length} dias/semana</span></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {formatHours(calculateHours(todayEntry).totalHours)}
                </div>
                <div className="text-sm text-gray-600">Horas Trabalhadas</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${getBalanceColor()}`}>
                  {getHoursBalance() >= 0 ? '+' : ''}{formatHours(getHoursBalance())}
                </div>
                <div className="text-sm text-gray-600">
                  {getBalanceLabel()}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Histórico de Hoje</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Entrada:</span>
                  <span className={`font-medium ${todayEntry.clockIn ? 'text-green-600' : 'text-gray-400'}`}>
                    {todayEntry.clockIn || '--:--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Almoço (Saída):</span>
                  <span className={`font-medium ${todayEntry.lunchOut ? 'text-yellow-600' : 'text-gray-400'}`}>
                    {todayEntry.lunchOut || '--:--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Almoço (Volta):</span>
                  <span className={`font-medium ${todayEntry.lunchIn ? 'text-blue-600' : 'text-gray-400'}`}>
                    {todayEntry.lunchIn || '--:--'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Saída:</span>
                  <span className={`font-medium ${todayEntry.clockOut ? 'text-red-600' : 'text-gray-400'}`}>
                    {todayEntry.clockOut || '--:--'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-800">Saldo Acumulado</div>
                <div className={`text-xl font-bold ${getBalanceColor()} mt-1`}>
                  {todayEntry.accumulatedBalance >= 0 ? '+' : ''}{formatHours(todayEntry.accumulatedBalance)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {todayEntry.accumulatedBalance >= 0 ? 'Crédito acumulado' : 'Débito a pagar'}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-800">Status Atual</div>
              <div className="mt-2">{getStatusBadge()}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diálogo de confirmação para saída */}
      <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Saída</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar seu expediente? 
              <br />
              <br />
              <strong>Resumo do dia:</strong>
              <br />
              • Entrada: {todayEntry.clockIn || '--:--'}
              <br />
              • Saída para almoço: {todayEntry.lunchOut || '--:--'}
              <br />
              • Retorno do almoço: {todayEntry.lunchIn || '--:--'}
              <br />
              • Horas trabalhadas: {formatHours(calculateHours(todayEntry).totalHours)}
              <br />
              • Saldo do dia: {getHoursBalance() >= 0 ? '+' : ''}{formatHours(getHoursBalance())}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleClockOutConfirmation}>
              Confirmar Saída
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
